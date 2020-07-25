import React from 'react';

const Layout = (props: { children: any; }) => {
  const {children} = props;
  return (
      <div>
        <main>{children}</main>
      </div>
  )
}

export default Layout;
