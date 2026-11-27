import { Request, Response } from 'express'
import err from 'utils/err'
import * as commonQueries from 'db/queries/common'
import * as profileQueries from 'db/queries/profile'
import mongoDB from 'db'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import { keywordSearchHelper } from 'utils/searchAndFilter'

export const isProfileNameValid = async (req: Request) => {
  const { name } = req.body

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return err('Please provide a valid profile name.', 'name')
  }

  return null
}

export const isProfileNameAlreadyExists = async (
  req: Request,
  res: Response
) => {
  const previousErrors = res.locals.validationErrors || []
  if (previousErrors.length) return null

  const { name } = req.body
  const { user } = res.locals
  const { profileId } = req.params

  const existingProfile = await commonQueries.findDocument(
    profileQueries.getCollection,
    mongoDB,
    {
      _id: { $ne: profileId },
      hospitalId: user.hospitalId,
      name: name.trim()
    }
  )

  if (existingProfile) {
    return err('Profile name already exists.', 'name')
  }
  return null
}

export const isProfileIdValid = async (req: Request) => {
  const profileId = getFieldIntoReq(req, 'profileId')
  const from = getFieldIntoReq(req, 'from')

  if (
    from !== 'onboarding' &&
    (!profileId || typeof profileId !== 'string' || profileId.trim() === '')
  ) {
    return err('Please provide a valid profile ID.', 'profileId')
  }

  return null
}

export const isProfileIdExists = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors || []
  if (previousErrors.length) return null

  const profileId = getFieldIntoReq(req, 'profileId')
  const from = getFieldIntoReq(req, 'from')
  const { user } = res.locals

  if (from === 'onboarding') {
    return null
  }

  const existingProfile = await commonQueries.findDocument(
    profileQueries.getCollection,
    mongoDB,
    {
      _id: profileId,
      hospitalId: user.hospitalId
    }
  )

  if (!existingProfile) {
    return err('Profile not found.', 'profileId')
  }

  let role = 'T'
  if (existingProfile.role === 'A') role = 'A'
  setFieldsIntoLocals(res, {
    profileData: existingProfile,
    role: role.trim()
  })

  return null
}

export const isProfileAccessValid = async (req: Request, res: Response) => {
  const { access, role } = req.body
  if (role === 'A') return null

  // TODO: names will change
  const validModules = [
    'admin',
    'doctor',
    'nurse',
    'roaster',
    'pharmacy',
    'patient',
    'appointment',
    'cashier'
  ]
  if (!access || typeof access !== 'object') {
    return err('Access must be an object with module permissions.', 'access')
  }

  for (const [module, permissionsRaw] of Object.entries(access)) {
    if (!validModules.includes(module)) {
      return err(`Invalid module name: ${module}`, 'access')
    }
    if (
      typeof permissionsRaw !== 'object' ||
      Array.isArray(permissionsRaw) ||
      permissionsRaw === null
    ) {
      return err(
        `Permissions for module "${module}" must be an object.`,
        'access'
      )
    }

    const permissions = permissionsRaw as Record<string, boolean>
    // Check for required permission keys and their boolean values
    const requiredKeys = ['view', 'modify']
    for (const key of requiredKeys) {
      if (!(key in permissions)) {
        return err(
          `Missing "${key}" permission for module "${module}".`,
          'access'
        )
      }
      if (typeof permissions[key] !== 'boolean') {
        return err(
          `Permission "${key}" for module "${module}" must be boolean.`,
          'access'
        )
      }
    }
  }

  return null
}

export const isDescriptionValid = async (req: Request) => {
  const { desc } = req.body
  if (!('desc' in req.body) || !desc) {
    return null
  }

  if (!desc.trim() || typeof desc !== 'string') {
    return err('Description must be a string.', 'desc')
  }

  if (desc.length < 2) {
    return err('Description must be at least 2 characters long.', 'desc')
  }

  return null
}

export const keywordSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { q, searchBy } = req.query

  if (!('q' in req.query)) {
    setFieldsIntoLocals(res, {
      searchCondition: {}
    })
    return null
  }

  let allowedKeywordToSerach = ['name']

  if (searchBy) {
    allowedKeywordToSerach = allowedKeywordToSerach.filter(
      (keyword) => keyword === searchBy
    )
  }

  const searchCondition = keywordSearchHelper(allowedKeywordToSerach, String(q))

  setFieldsIntoLocals(res, {
    searchCondition
  })

  return null
}
