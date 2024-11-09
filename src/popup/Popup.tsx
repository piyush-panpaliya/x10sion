import React, { JSX, useEffect } from 'react'

import { rpc } from '@/utils/bgCaller'

export default function Popup(): JSX.Element {
  useEffect(() => {
    ;(async () => {
      try {
        const res = await rpc('user.signin', {
          username: 'admin',
          password: 'admin',
        })
        console.log(res)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])
  return (
    <div id='my-ext' className='container' data-theme='light'>
      <button type='button' className='btn btn-outline'>
        Default
      </button>
      <button type='button' className='btn btn-outline btn-primary'>
        Primary
      </button>
      <button type='button' className='btn btn-outline btn-secondary'>
        Secondary
      </button>
      <button type='button' className='btn btn-outline btn-accent'>
        Accent
      </button>
    </div>
  )
}
