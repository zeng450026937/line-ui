function inserted(el, binding) {
  if (!binding.value) return;

  const callback = binding.value.callback;
  const options = binding.options || {
    rootMargin: '0px',
    threshold: [0],
  };
  const viewport = document.querySelector(binding.arg);

  options.root = binding.value.viewport || viewport;

  const io = new window.IntersectionObserver((entries, observer) => {
    callback(entries, observer, el, binding.value.context);
  }, options);

  io.observe(el);

  el.x_observer = {
    callback,
    options,
    viewport,
    io,
  };
}

function unbind(el) {
  if (!el.x_observer) return;

  const { io } = el.x_observer;

  io.unobserve(el);

  delete el.x_observer;
}

export default {
  inserted,
  unbind,
};
