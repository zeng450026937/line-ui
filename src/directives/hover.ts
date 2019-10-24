/* eslint-disable no-unused-expressions */

function mouseenter(event, wrapper) {
  wrapper.enterX = event.clientX;
  wrapper.enterY = event.clientY;
  wrapper.enter && wrapper.enter(Object.assign(event, wrapper));
}
function mouseover(event, wrapper) {
  wrapper.hoverX = event.clientX;
  wrapper.hoverY = event.clientY;
  wrapper.hover && wrapper.hover(Object.assign(event, wrapper));
}
function mouseleave(event, wrapper) {
  wrapper.leaveX = event.clientX;
  wrapper.leaveY = event.clientY;
  wrapper.leave && wrapper.leave(Object.assign(event, wrapper));
}

function createHandlers(value) {
  const wrapper = {
    enterX: 0,
    enterY: 0,
    leaveX: 0,
    leaveY: 0,
    hoverX: 0,
    hoverY: 0,
    enter: value.enter,
    leave: value.leave,
    hover: value.hover,
  };

  return {
    mouseenter: e => mouseenter(e, wrapper),
    mouseover: e => mouseover(e, wrapper),
    mouseleave: e => mouseleave(e, wrapper),
  };
}

function inserted(el, binding, vnode) {
  if (!binding.value) return;

  const {
    parent,
    options = { passive: true },
  } = binding.value;
  const target = parent ? el.parentElement : el;

  if (!target) return;

  const handlers = createHandlers(binding.value);

  target._hoverHandlers = Object(target._hoverHandlers);
  target._hoverHandlers[vnode.context._uid] = handlers;

  Object.keys(handlers).forEach((eventName) => {
    target.addEventListener(eventName, handlers[eventName], options);
  });
}

function unbind(el, binding, vnode) {
  const target = binding.value.parent ? el.parentElement : el;

  if (!target || !target._hoverHandlers) return;

  const handlers = target._hoverHandlers[vnode.context._uid];

  Object.keys(handlers).forEach((eventName) => {
    target.removeEventListener(eventName, handlers[eventName]);
  });
  delete target._hoverHandlers[vnode.context._uid];
}

export default {
  inserted,
  unbind,
};
