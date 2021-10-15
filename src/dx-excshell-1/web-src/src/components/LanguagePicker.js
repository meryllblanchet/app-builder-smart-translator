/* 
* <license header>
*/

import React from 'react'
import PropTypes from 'prop-types'
import {
  Picker,
  Item,
} from '@adobe/react-spectrum'

/**
 * Just a custom picker to display the dynamic and localized list of languages available for translation
 * @param {*} props the list of properties defined for the custom picker
 * @returns 
 */
const LanguagePicker = (props) => {  
  return (
        <Picker label={props.label}
          name={props.name}
          isRequired={true}
          placeholder={props.placeholder}
          aria-label={props.ariaLabel}
          width={props.width}
          items={props.languagesList}
          onSelectionChange={props.onSelectionChange}
          itemKey="language">

          {(item) => <Item key={item.language}>{item.name}</Item>}
        </Picker>
  )
}

LanguagePicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  width: PropTypes.string,
  onSelectionChange: PropTypes.any,
  languagesList: PropTypes.array
}

export default LanguagePicker
