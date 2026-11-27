import { Request, Response } from 'express'
import * as vitalQueries from 'db/queries/vitals'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import { validateComplaints } from './helper'
import { multipleErrorsSymbol } from 'services/rest/middlewares/validate'
import err, { handleMultipleErrors } from 'utils/err'
import mongoDB from 'db'

export const isVitalAlreadyExists = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors || []
  if (previousErrors.length) return null

  const { visitId } = res.locals.shared || {}
  const { user } = res.locals || {}

  const vitalData = await vitalQueries.getVitalsByCondition(mongoDB, {
    visitId,
    hospitalId: user.hospitalId
  })

  if (vitalData) {
    return err('Vital already exists for this visit.', 'visitId')
  }

  return null
}

export const isVitalIdValid = async (req: Request, res: Response) => {
  const vitalId = getFieldIntoReq(req, 'vitalId')
  const { user } = res.locals || {}

  const vitalData = await vitalQueries.getVitalsByCondition(mongoDB, {
    _id: vitalId,
    hospitalId: user.hospitalId
  })

  if (!vitalData) {
    return err('Vital not found.', 'vitalId')
  }

  setFieldsIntoLocals(res, {
    vitalData,
    vitalId
  })

  return null
}

export const isHeightValid = async (req: Request, res: Response) => {
  const { height } = req.body
  if (!('height' in req.body) || !height) return null

  if (typeof height !== 'number' || height <= 0) {
    return err('Height is required and should be a positive number.', 'height')
  }

  setFieldsIntoLocals(res, {
    height
  })

  return null
}

export const isWeightValid = async (req: Request, res: Response) => {
  const { weight } = req.body

  if (!('weight' in req.body) || !weight) return null

  if (typeof weight !== 'number' || weight <= 0) {
    return err('Weight is required and should be a positive number.', 'weight')
  }

  setFieldsIntoLocals(res, {
    weight
  })

  return null
}

export const isBMIValid = async (req: Request, res: Response) => {
  const { bmi } = req.body

  if (!('bmi' in req.body) || !bmi) return null

  if (typeof bmi !== 'number' && bmi <= 0) {
    return err('BMI is required and should be a positive number.', 'bmi')
  }

  setFieldsIntoLocals(res, {
    bmi
  })

  return null
}

export const isRespirationRateValid = async (req: Request, res: Response) => {
  const { respirationRate } = req.body

  if (!('respirationRate' in req.body) || !respirationRate) return null

  if (typeof respirationRate !== 'number' || respirationRate <= 0) {
    return err(
      'Respiration rate is required and should be a positive number.',
      'respirationRate'
    )
  }

  setFieldsIntoLocals(res, {
    respirationRate
  })

  return null
}

export const isTemperatureValid = async (req: Request, res: Response) => {
  const { temperature } = req.body

  if (!('temperature' in req.body) || !temperature) return null

  if (typeof temperature !== 'number' || temperature <= 0) {
    return err(
      'Temperature is required and should be a positive number.',
      'temperature'
    )
  }

  setFieldsIntoLocals(res, {
    temperature
  })

  return null
}

export const isPulseValid = async (req: Request, res: Response) => {
  const { pulse } = req.body

  if (!('pulse' in req.body) || !pulse) return null

  if (typeof pulse !== 'number' || pulse <= 0) {
    return err('Pulse is required and should be a positive number.', 'pulse')
  }

  setFieldsIntoLocals(res, {
    pulse
  })

  return null
}

export const isBPValid = async (req: Request, res: Response) => {
  const { bp } = req.body

  if (!('bp' in req.body) || !bp) return null

  if (typeof bp !== 'string' && !/^\d{2,3}\/\d{2,3}$/.test(bp)) {
    return err('BP is should be in the format "systolic/diastolic".', 'bp')
  }
  setFieldsIntoLocals(res, {
    bp
  })

  return null
}

export const isSpo2Valid = async (req: Request, res: Response) => {
  const { spo2 } = req.body
  if (!('spo2' in req.body) || !spo2) return null

  if (typeof spo2 !== 'number' || spo2 < 0 || spo2 > 100) {
    return err(
      'SpO2 is required and should be a number between 0 and 100.',
      'spo2'
    )
  }

  setFieldsIntoLocals(res, {
    spo2
  })

  return null
}

export const isBSFValid = async (req: Request, res: Response) => {
  const { bsf } = req.body
  if (!('bsf' in req.body) || !bsf) return null

  if (typeof bsf !== 'number' || bsf < 0) {
    return err(
      'Blood sugar fasting is required and should be a positive number.',
      'bsf'
    )
  }

  setFieldsIntoLocals(res, {
    bsf
  })

  return null
}

export const isrbsValid = async (req: Request, res: Response) => {
  const { rbs } = req.body

  if (!('rbs' in req.body) || !rbs) return null

  if (typeof rbs !== 'number' || rbs < 0) {
    return err(
      'Blood sugar random is required and should be a positive number.',
      'rbs'
    )
  }

  setFieldsIntoLocals(res, {
    rbs
  })

  return null
}

export const isBSPPValid = async (req: Request, res: Response) => {
  const { bspp } = req.body
  if (!('bspp' in req.body) || !bspp) return null

  if (typeof bspp !== 'number' || bspp < 0) {
    return err(
      'Blood sugar post prandial is required and should be a positive number.',
      'bspp'
    )
  }

  setFieldsIntoLocals(res, {
    bspp
  })

  return null
}

export const isComplaintsValid = async (req: Request, res: Response) => {
  if (!('complaints' in req.body)) return null

  const { complaints } = req.body

  const complaintsValidation = validateComplaints(complaints)

  if (
    complaintsValidation.error &&
    complaintsValidation.validationErrors?.length
  ) {
    return handleMultipleErrors(
      complaintsValidation.validationErrors,
      multipleErrorsSymbol
    )
  }

  setFieldsIntoLocals(res, {
    complaints
  })

  return null
}
