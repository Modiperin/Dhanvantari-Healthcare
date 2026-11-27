import { ComplaintsType } from 'types/patient'

export const validateComplaints = (complaints: ComplaintsType[]) => {
  const errors: { field: string; message: string }[] = []

  if (!Array.isArray(complaints)) {
    errors.push({
      field: 'complaints',
      message: 'Invalid complaints details.'
    })
    return { error: true, validationErrors: errors }
  }

  complaints.forEach((complaint, idx) => {
    if (
      'chiefComplaints' in complaint &&
      (typeof complaint.chiefComplaints !== 'string' ||
        complaint.chiefComplaints.trim().length < 2)
    ) {
      errors.push({
        field: `complaints.${idx}.chiefComplaints`,
        message: 'Please provide valid chief complaints.'
      })
    }

    if (
      'severness' in complaint &&
      complaint.severness &&
      complaint.severness.trim().length < 2
    ) {
      errors.push({
        field: `complaints.${idx}.severness`,
        message: 'Please provide valid severness.'
      })
    }

    if (
      'region' in complaint &&
      complaint.region &&
      complaint.region.trim().length < 2
    ) {
      errors.push({
        field: `complaints.${idx}.region`,
        message: 'Please provide valid region.'
      })
    }

    if (
      'bsf' in complaint &&
      complaint.bsf &&
      complaint.bsf.trim().length < 2
    ) {
      errors.push({
        field: `complaints.${idx}.bsf`,
        message: 'Please provide valid bsf.'
      })
    }
  })

  if (errors.length) {
    return { error: true, validationErrors: errors }
  }

  return { error: false }
}
