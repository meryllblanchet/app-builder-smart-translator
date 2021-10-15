/* 
* <license header>
*/

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Heading,
  Form,
  TextArea,
  ActionButton,
  ProgressCircle,
  Text,
  View
} from '@adobe/react-spectrum'
import Function from '@spectrum-icons/workflow/Function'

import LanguagePicker from './LanguagePicker'
import actions from '../config.json'
import actionWebInvoke from '../utils'

const TranslationForm = (props) => {

  // Stores the localized list of languages
  const [languagesList, setLanguagesList] = useState([]);
  // Fetches the list of languages only once the TranslationForm component is mounted
  useEffect(() => {    
    actionWebInvoke(actions['languages'], null, {target: props.runtimeLocale || ''}, { method: 'GET' }).then(results => setLanguagesList(results))
  }, [])

  // Stores the TranslationForm state based on user interactions
  const [translationState, setTranslationState] = useState({
    actionParams: null,
    actionParamsValid: null,
    actionInvokeInProgress: false,
    translationResult: '',
    sourceLanguage: null,
    targetLanguage: null
  })

  return (
    <View width="size-7000">
      <Heading level={1}>Enter some text to translate, s'il vous plaît!</Heading>
        <Form necessityIndicator="label">
          <LanguagePicker 
            name="sourceLanguage" 
            label="From:" 
            placeholder="Select a source language" 
            ariaLabel="Select a source language" 
            width="size-6000" 
            onSelectionChange={(value) => setTranslationState({...translationState, sourceLanguage: value})}
            languagesList={languagesList}
          />
          <LanguagePicker 
            name="targetLanguage" 
            label="To:" 
            placeholder="Select a target language" 
            ariaLabel="Select a target language" 
            width="size-6000"
            onSelectionChange={(value) => setTranslationState({...translationState, targetLanguage: value})}
            languagesList={languagesList}
          />
          <TextArea
            label="Your text here:"
            placeholder='Enter the text to translate!'
            necessityIndicator=""
            width="size-6000"
            validationState={translationState.actionParamsValid}
            onChange={(input) =>
              setTranslationInput(input, 'actionParams', 'actionParamsValid')
            }
          />
          <Flex>
            <ActionButton
              variant="primary"
              type="button"
              onPress={translate.bind(this)}
              isDisabled={!translationState.actionParamsValid}
            ><Function aria-label="Translate" /><Text>Translate</Text></ActionButton>

            <ProgressCircle
              aria-label="loading"
              isIndeterminate
              isHidden={!translationState.actionInvokeInProgress}
              marginStart="size-100"
            />
          </Flex>
        </Form>
      <TextArea
            label="Your translated text:"
            isReadOnly={true}
            width="size-6000"
            maxWidth="100%"
            value={translationState.translationResult}
      />
    </View>
  )

  // Methods

  // Adds the content to translate to the state
  // Possible to implement validation logic here as well
  async function setTranslationInput (input, stateContent, stateValid) {
    let content
    let validStr = null
    if (input) {
      try {
        content = input
        validStr = 'valid'
      } catch (e) {
        content = null
        validStr = 'invalid'
      }
    }
    setTranslationState({ ...translationState, [stateContent]: content, [stateValid]: validStr, translationResult: '' })
  }

  // Invokes a the selected backend actions with input headers and params
  async function translate () {
    setTranslationState({ ...translationState, actionInvokeInProgress: true, translationResult: 'calling action ... ' })
    const params = { 'q': translationState.actionParams, source: translationState.sourceLanguage, target: translationState.targetLanguage || {} }
    const startTime = Date.now()
    try {
      // Invokes backend action
      const actionResponse = await actionWebInvoke(actions['translate'], null, params)
      // Stores the response
      setTranslationState({
        ...translationState,
        translationResult:actionResponse,
        actionInvokeInProgress: false
      })
    } catch (e) {
      // Logs and stores any error message to be displayed in the form
      const formattedResult = `time: ${Date.now() - startTime} ms\n` + e.message
      console.error(e)
      setTranslationState({
        ...translationState,
        translationResult:formattedResult,
        actionInvokeInProgress: false
      })
    }
  }
}

TranslationForm.propTypes = {
  runtimeLocale: PropTypes.string
}

export default TranslationForm
