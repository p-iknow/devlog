import { useRef } from 'react';

const useOffsetTop = () => {
  const ref = useRef<HTMLElement>();

  const offsetTop = ref.current
    ? ref.current.getBoundingClientRect().top + document.documentElement.scrollTop
    : 0;

  return [ref, offsetTop] as const;
};

export default useOffsetTop;
