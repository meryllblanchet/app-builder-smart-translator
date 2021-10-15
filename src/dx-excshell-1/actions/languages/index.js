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
 
 // Function which reads the target language from the action request parameters
 // The target language is converted to ISO-639-1 format for API compatibility reasons, with a few exceptions
 function getTargetLanguage (params) {
   return convertToISO6391(params.target)
 }
 
 // main function that will be executed by Adobe I/O Runtime
 async function main (params) {
   // Creates a Logger
   const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
 
   try {
     // 'info' is the default level if not set
     logger.info('Calling the main action')
 
     // Logs parameters, only if params.LOG_LEVEL === 'debug'
     logger.debug(stringParameters(params))
 
     // Checks for missing request input parameters and headers
     const requiredParams = ['translateApiKey']
     const requiredHeaders = []
     const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
     if (errorMessage) {
       // Returns and logs client errors
       return errorResponse(400, errorMessage, logger)
     }
 
     // extract the user Bearer token from the Authorization header
     const translateApiKey = getTranslateApiKey(params)
     const target = getTargetLanguage(params)
 
     // The Google Translate API endpoint to use
     const apiEndpoint = 'https://translation.googleapis.com/language/translate/v2/languages'
     // Appends API Key and target language for available languages names
     const fetchUrl = apiEndpoint + '?key=' + translateApiKey + '&target=' + target
     // Fetches content from external api endpoint
     const res = await fetch(fetchUrl)
     if (!res.ok) {
       throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status)
     }
     // Builds the Adobe I/O Runtime response from the API call response
     const content = await res.json()
     const response = {
       statusCode: 200,
       body: content && content.data && content.data.languages
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
 