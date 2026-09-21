import { NextResponse } from 'next/server'
import type { Where } from 'payload'
import { getPayload } from 'payload'

import config from '@payload-config'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const from = url.searchParams.get('from') || ''
  const to = url.searchParams.get('to') || ''
  const category = url.searchParams.get('category') || ''
  const format = url.searchParams.get('format')
  if ((from && !datePattern.test(from)) || (to && !datePattern.test(to))) return NextResponse.json({ error: 'Invalid date.' }, { status: 400 })

  const conditions: Where[] = []
  if (from) conditions.push({ expenseDate: { greater_than_equal: `${from}T00:00:00.000Z` } })
  if (to) conditions.push({ expenseDate: { less_than_equal: `${to}T23:59:59.999Z` } })
  if (category) conditions.push({ category: { equals: category } })
  const where: Where = conditions.length ? { and: conditions } : {}

  const [expenses, categories] = await Promise.all([
    payload.find({ collection: 'expenses', where, sort: '-expenseDate', limit: 1000, pagination: false, depth: 1, overrideAccess: true }),
    payload.find({ collection: 'expense-categories', where: { active: { equals: true } }, sort: 'order', limit: 100, pagination: false, depth: 0, overrideAccess: true }),
  ])

  if (format === 'csv') {
    const quote = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const rows = [['Date', 'Category', 'Title', 'Amount (PKR)', 'Status', 'Payment Method', 'Vendor / Paid To', 'Reference Number', 'Notes']]
    for (const expense of expenses.docs) {
      const categoryName = typeof expense.category === 'object' ? expense.category.name : ''
      rows.push([expense.expenseDate.slice(0, 10), categoryName, expense.title || '', String(expense.amount), expense.status, expense.paymentMethod, expense.vendor || '', expense.referenceNumber || '', expense.notes || ''])
    }
    const csv = rows.map((row) => row.map(quote).join(',')).join('\r\n')
    return new Response(`\uFEFF${csv}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="care-and-cure-expenses-${from || 'all'}-${to || 'all'}.csv"`, 'Cache-Control': 'no-store' } })
  }

  const total = expenses.docs.filter((expense) => expense.status !== 'cancelled').reduce((sum, expense) => sum + expense.amount, 0)
  return NextResponse.json({ expenses: expenses.docs, categories: categories.docs, total, count: expenses.docs.length }, { headers: { 'Cache-Control': 'no-store' } })
}
