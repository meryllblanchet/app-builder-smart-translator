/* 
* <license header>
*/

import React from 'react'
import { Heading, View, Content, Link } from '@adobe/react-spectrum'
export const About = () => (
  <View width="size-6000">
    <Heading level={1}>Useful documentation for your app</Heading>
    <Content>
      <ul style={{ listStyle: 'none' }}>
        <li>
          <Link>
            <a href='https://developer.adobe.com/app-builder/docs/overview/' target='_blank'>
              Adobe Developer App Builder Docs
            </a>
          </Link>
        </li>
        <li>
          <Link>
            <a href='https://github.com/adobe/aio-sdk' target='_blank'>
              Adobe Developer App Builder SDK
            </a>
          </Link>
        </li>
        <li>
          <Link>
            <a href='https://www.adobe.io/apis/experienceplatform/runtime/docs.html' target='_blank'>
              Adobe I/O Runtime
            </a>
          </Link>
        </li>
        <li>
          <Link>
            <a href='https://react-spectrum.adobe.com/react-spectrum/index.html' target='_blank'>
              React Spectrum
            </a>
          </Link>
        </li>
      </ul>
    </Content>
  </View>
)
