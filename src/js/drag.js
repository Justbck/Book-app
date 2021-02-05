/* eslint-disable no-new */
export default function Drag() {
  // drag & drop sort
  const dragItem = document.getElementById('book-list');
  // eslint-disable-next-line no-undef
  new Sortable(dragItem, {
    handle: '.handle',
    animation: 300,
  });
}
