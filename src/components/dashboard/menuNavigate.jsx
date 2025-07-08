'use client'

import React from 'react'
import { IconList, IconShoppingCart } from '@tabler/icons-react'

function handleMenuAction() {
  console.log(' masuk <<< ')
}

const MenuNavigate = () => {
  return <>
      <div
          className="footer-wrapper"
          style={{ height: '105px' }}
        >
          <div
            className="footer-content  bg-yellowBackground "
            style={{ height: '105px' }}
          >
            <div
              className="content-wrapper flex  justify-content-evenly"
              style={{ height: '100%' }}
            >
              <button onClick={handleMenuAction}>
                <IconList
                  size={75}
                  className="text-greenSecondary"
                />
              </button>

              <button onClick={handleMenuAction}>
                <IconShoppingCart
                  size={75}
                  className="text-greenSecondary"
                />
              </button>
            </div>
          </div>
        </div>
  </>
}

export default MenuNavigate
