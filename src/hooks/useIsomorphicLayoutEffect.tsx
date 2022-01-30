// 서버사이드 렌더링 시 useLayoutEffect가 없기 때문에 아래와 같은 처리가 필요

import { useEffect, useLayoutEffect } from 'react';
import isServer from 'utils/isServer';

// https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a
const useIsomorphicLayoutEffect = isServer() ? useEffect : useLayoutEffect;

export default useIsomorphicLayoutEffect;
