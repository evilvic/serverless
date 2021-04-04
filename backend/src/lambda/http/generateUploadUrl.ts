import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { updateAttachmentUrl } from '../../businessLogic/todos'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId

  const authHeader = event.headers.Authorization
  const split = authHeader.split(' ')
  const jwt = split[1]

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: Number(urlExpiration)
  })
  const imageUrl = parseImageUrl(uploadUrl)

  const updatedItem = await updateAttachmentUrl(todoId, imageUrl, jwt)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl,
      item: updatedItem
    })
  }
  
}

function parseImageUrl(uploadUrl: string) {
  return uploadUrl.split("?")[0]
}