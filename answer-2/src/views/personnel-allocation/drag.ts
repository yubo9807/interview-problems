
let fromEl = null;
let toEl = null;

type Callback = (from: HTMLElement, to: HTMLElement) => void

/**
 * 拖拽元素
 * @param wrapEl 
 * @param callback 回调
 */
export default function(wrapEl: HTMLElement, callback?: Callback) {
  wrapEl.addEventListener('dragstart', onDragstart);
  wrapEl.addEventListener('dragenter', onDragenter);
  wrapEl.addEventListener('dragleave', onDragleave);
  wrapEl.addEventListener('dragover', onDragover);
  wrapEl.addEventListener('drop', e => onDrop(e, callback));
}

function onDragstart(event: DragEvent) {
  fromEl = event.target;
}

function onDragenter(event: DragEvent) {
  const el = event.target;
  el && (el as HTMLElement).classList.add('active');
  toEl = el;
}

function onDragleave(event: DragEvent) {
  const el = event.target;
  el && (el as HTMLElement).classList.remove('active');
}

function onDragover(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent, callback: Callback) {
  toEl.classList.remove('active');
  callback && callback(fromEl, toEl);
}
