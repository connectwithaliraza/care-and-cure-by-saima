import { ExpenseReport as ExpenseReport_85e4ee6db0c9219f872482c79fa9ddaf } from '@/components/admin/ExpenseReport'
import { PatientDashboard as PatientDashboard_d4d16bd7f419d3bfdf6453e33d20e19e } from '@/components/admin/PatientDashboard'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@/components/admin/ExpenseReport#ExpenseReport": ExpenseReport_85e4ee6db0c9219f872482c79fa9ddaf,
  "@/components/admin/PatientDashboard#PatientDashboard": PatientDashboard_d4d16bd7f419d3bfdf6453e33d20e19e,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
