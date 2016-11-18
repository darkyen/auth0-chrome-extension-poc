export class EventEmitterLight {

  events = {};

  constructor() {}

  on(ev, handler) {
    (this.events[ev] || (this.events[ev] = [])).push(handler);
  }

  removeListener(ev, handler) {
    let array = this.events[ev];
    array && array.splice(array.indexOf(handler), 1);
  }

  emit(ev) {
    let args = [].slice.call(arguments, 1),
      array = this.events[ev] || [];

    for (var i = 0, len = array.length; i < len; i++) {
      array[i].apply(this, args);
    }
  }

  once(ev, handler) {
    this.on(ev, remover);

    function remover() {
      handler.apply(this, arguments);
      this.removeListener(ev, remover);
    }
  }
}