import mongoDB from 'db'
import * as commonQueries from 'db/queries/common'
import * as staffQueries from 'db/queries/staff'
import { subMilliseconds } from 'date-fns'
import { oneDayInMilliseconds } from '..'

export default async (jobStartTime: number) => {
  const previousDayTimestamp = subMilliseconds(
    jobStartTime,
    oneDayInMilliseconds
  )

  const userList = await commonQueries.findDocuments(
    staffQueries.getCollection,
    mongoDB,
    {
      accessType: 'T', // Temporary access
      accessEndTime: {
        $gt: new Date(previousDayTimestamp),
        $lte: new Date(jobStartTime)
      }
    },
    {
      userId: 1,
      email: 1,
      name: 1,
      hospitalId: 1
    }
  )

  if (!userList.length) {
    console.log('No users to revoke access.')
    return
  }

  await commonQueries.updateDocuments(
    staffQueries.getCollection,
    mongoDB,
    {
      userId: { $in: userList.map((user) => user.userId) }
    },
    {
      $set: {
        isLocked: true,
        lockedAt: new Date()
      },
      $unset: {
        accessEndTime: ''
      }
    }
  )
}
