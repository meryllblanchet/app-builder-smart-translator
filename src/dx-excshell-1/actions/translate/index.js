/*
* <license header>
*/

/**
 * This is a sample action integrating with Google Translation API
 *
 * Note:
 * Authentication and authorization checks against Adobe Identity Management System have been deactivated for this Runtime action.
 */

 const fetch = require('node-fetch')
 const { Core } = require('@adobe/aio-sdk')
 const { errorResponse, stringParameters, checkMissingRequestInputs, convertToISO6391 } = require('../utils')
 
 // Function which reads the translate API key from the action request parameters
 // This key is configured as default parameter for the action in ext.config.yaml
 // Hence it is passed by Adobe I/O Runtime upon action invocation
 function getTranslateApiKey (params) {
   return params.translateApiKey
 }
 
 // Function which reads the text to translate from the action request parameters
 function getText (params) {
   return params.q
 }

 // Function which reads the source language from the action request parameters
 // Defaults to French
 function getSourceLanguage (params) {
   return convertToISO6391(params.source)
 }

 // Function which reads the target language from the action request parameters
 // Defaults to English
 function getTargetLanguage (params) {
   return convertToISO6391(params.target)
 }

 // Function which reads the text format from the action request parameters
 // Defaults to text
 function getFormat (params) {
   return params.format || 'text'
 }

 // Function which builds the params object for a fetch call using POST
 function buildApiCallParams(params) {
  const apiCallParams = new URLSearchParams()
  apiCallParams.append('key', getTranslateApiKey(params))
  apiCallParams.append('q', getText(params))
  apiCallParams.append('source', getSourceLanguage(params))
  apiCallParams.append('target', getTargetLanguage(params))
  apiCallParams.append('format', getFormat(params))
  return apiCallParams
 }
 
 // main function that will be executed by Adobe I/O Runtime
 async function main (params) {
   // create a Logger
   const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
   try {
     // 'info' is the default level if not set
     logger.info('Calling the main action')
     // log parameters, only if params.LOG_LEVEL === 'debug'
     logger.debug(stringParameters(params))
     // check for missing request input parameters and headers
     const requiredParams = ['q', 'translateApiKey']
     const requiredHeaders = []
     const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
     if (errorMessage) {
       // return and log client errors
       return errorResponse(400, errorMessage, logger)
     }
     // The Google Translate API endpoint to use
     const apiEndPoint = 'https://translation.googleapis.com/language/translate/v2'
     // Builds list of parameters for the POST request
     const fetchParams = buildApiCallParams(params)
     // Fetches content from Google Translate API, using a POST method
     const res = await fetch(apiEndPoint, {method: 'POST', body: fetchParams})
     if (!res.ok) {
       throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status)
     }
     // Builds the Adobe I/O Runtime response from the API call response
     const content = await res.json()
     const response = {
       statusCode: 200,
       body: content && content.data && content.data.translations[0] && content.data.translations[0].translatedText
     }
     // Logs the response status code
     logger.info(`${response.statusCode}: successful request`)
     return response
   } catch (error) {
     // Logs any server errors
     logger.error(error)
     // Returns with 500
     return errorResponse(500, 'server error', logger)
   }
 }
 
 exports.main = main
 