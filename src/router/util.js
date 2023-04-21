export function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    loading: require('@views/_loading').default,
    delay: 400,
    error: require('@views/_timeout').default,
    timeout: 60000
  });
  return Promise.resolve({
    functional: true,
    render(h, {data, children}) {
      return h(AsyncHandler, data, children);
    }
  });
}