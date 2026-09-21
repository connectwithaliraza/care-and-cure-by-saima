'use client'

import { useCallback, useEffect, useState } from 'react'

type Category = { id: number | string; name: string }
type Expense = { id: number | string; expenseDate: string; category: number | Category; title?: string | null; amount: number; status: string; paymentMethod: string; vendor?: string | null; referenceNumber?: string | null }
type Report = { expenses: Expense[]; categories: Category[]; total: number; count: number }

const today = new Date().toISOString().slice(0, 10)
const monthStart = `${today.slice(0, 8)}01`
const labels: Record<string, string> = { paid: 'Paid', pending: 'Pending', reimbursed: 'Reimbursed', cancelled: 'Cancelled', cash: 'Cash', 'bank-transfer': 'Bank transfer', card: 'Card', easypaisa: 'EasyPaisa', jazzcash: 'JazzCash', cheque: 'Cheque', other: 'Other' }

export function ExpenseReport() {
  const [from, setFrom] = useState(monthStart); const [to, setTo] = useState(today); const [category, setCategory] = useState('')
  const [applied, setApplied] = useState({ from: monthStart, to: today, category: '' }); const [report, setReport] = useState<Report>({ expenses: [], categories: [], total: 0, count: 0 }); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const load = useCallback(async () => { setLoading(true); setError(''); const query = new URLSearchParams(applied); try { const response = await fetch(`/api/expense-report?${query}`, { credentials: 'include' }); if (!response.ok) throw new Error('Unable to load expenses.'); setReport(await response.json()) } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load expenses.') } finally { setLoading(false) } }, [applied])
  useEffect(() => { void load() }, [load])
  function apply(event: React.FormEvent) { event.preventDefault(); setApplied({ from, to, category }) }
  function reset() { setFrom(monthStart); setTo(today); setCategory(''); setApplied({ from: monthStart, to: today, category: '' }) }
  const exportURL = `/api/expense-report?${new URLSearchParams({ ...applied, format: 'csv' })}`

  return <div style={{ padding: '32px', maxWidth: 1500, margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}><div><h1 style={{ margin: 0 }}>Expenses</h1><p style={{ margin: '8px 0 0', color: 'var(--theme-elevation-600)' }}>Filter clinic expenses by date and expense type.</p></div><a className="btn btn--style-primary" href="/admin/collections/expenses/create">Add expense</a></div>
    <form onSubmit={apply} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr)) auto auto', gap: 14, alignItems: 'end', padding: 22, border: '1px solid var(--theme-elevation-150)', borderRadius: 10, background: 'var(--theme-elevation-50)' }}>
      <label style={{ display: 'grid', gap: 7 }}><span>From date</span><input className="field-type text" type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} /></label>
      <label style={{ display: 'grid', gap: 7 }}><span>To date</span><input className="field-type text" type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} /></label>
      <label style={{ display: 'grid', gap: 7 }}><span>Expense type</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All expense types</option>{report.categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
      <button className="btn btn--style-primary" type="submit">Apply</button><button className="btn btn--style-secondary" type="button" onClick={reset}>Reset</button>
    </form>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center', margin: '24px 0' }}><div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}><strong>{report.count} expense{report.count === 1 ? '' : 's'}</strong><strong>Total: PKR {report.total.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</strong></div><a className="btn btn--style-secondary" href={exportURL}>Export CSV</a></div>
    {error ? <div style={{ padding: 16, color: 'var(--theme-error-600)' }}>{error}</div> : null}
    <div style={{ overflowX: 'auto', border: '1px solid var(--theme-elevation-150)', borderRadius: 10 }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}><thead><tr>{['Date', 'Expense type', 'Title', 'Amount', 'Status', 'Payment', 'Vendor', 'Reference'].map((heading) => <th key={heading} style={{ textAlign: 'left', padding: 14, borderBottom: '1px solid var(--theme-elevation-150)', background: 'var(--theme-elevation-50)' }}>{heading}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={8} style={{ padding: 28, textAlign: 'center' }}>Loading expenses…</td></tr> : report.expenses.length ? report.expenses.map((expense) => <tr key={expense.id}><td style={{ padding: 13, borderBottom: '1px solid var(--theme-elevation-100)' }}><a href={`/admin/collections/expenses/${expense.id}`}>{new Date(expense.expenseDate).toLocaleDateString('en-PK')}</a></td><td style={{ padding: 13, borderBottom: '1px solid var(--theme-elevation-100)' }}>{typeof expense.category === 'object' ? expense.category.name : '—'}</td><td style={{ padding: 13, borderBottom: '1px solid var(--theme-elevation-100)' }}>{expense.title || '—'}</td><td style={{ padding: 13, borderBottom: '1px solid var(--theme-elevation-100)' }}>PKR {expense.amount.toLocaleString('en-PK')}</td><td style={{ padding: 13, borderBottom: '1px solid var(--theme-elevation-100)' }}>{labels[expense.status] || expense.status}</td><td style={{ padding: 13, borderBottom: '1px solid var(--theme-elevation-100)' }}>{labels[expense.paymentMethod] || expense.paymentMethod}</td><td style={{ padding: 13, borderBottom: '1px solid var(--theme-elevation-100)' }}>{expense.vendor || '—'}</td><td style={{ padding: 13, borderBottom: '1px solid var(--theme-elevation-100)' }}>{expense.referenceNumber || '—'}</td></tr>) : <tr><td colSpan={8} style={{ padding: 28, textAlign: 'center' }}>No expenses found for this period.</td></tr>}</tbody></table></div>
  </div>
}
