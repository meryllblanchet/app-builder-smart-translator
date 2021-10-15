/*
* <license header>
*/

import React from 'react'
import { Heading, View, Content, Link } from '@adobe/react-spectrum'
export const Home = () => (
  <View width='size-7000'>
    <Heading level={1}>Welcome to Smart Translator!</Heading>
    <Content>This is a very lazy sample application, which integrates with <Link><a href="https://cloud.google.com/translate/docs/reference/rest/v2/translate" target="_blank">Google Translation API.</a></Link></Content>
    <Content>It can only translate from French to English. This is an extremely lazy app :-)</Content>
  </View>
)

