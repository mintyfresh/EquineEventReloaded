import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Children } from 'react';

const ActiveLink = ({ children, activeClassName, ...props }: any) => {
  const { asPath } = useRouter();
  const active = asPath === props.href || asPath === props.as;

  if (!active) {
    return (
      <Link {...props}>{children}</Link>
    );
  }

  const child = Children.only(children);

  return (
    <Link {...props}>
      {React.cloneElement(child, { active: true })}
    </Link>
  );
};

export default ActiveLink;
