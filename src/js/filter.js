export default function filter() {
  (function () {
    // eslint-disable-next-line wrap-iife
    const TableFilter = (function () {
      const Arr = Array.prototype;
      let input;

      function onInputEvent(e) {
        input = e.target;
        const table1 = document.getElementsByClassName(input.getAttribute('data-table'));
        Arr.forEach.call(table1, (table) => {
          Arr.forEach.call(table.tBodies, (tbody) => {
            Arr.forEach.call(tbody.rows, filter);
          });
        });
      }

      function filter(row) {
        const text = row.textContent.toLowerCase();
        // console.log(text);
        const val = input.value.toLowerCase();
        // console.log(val);
        row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
      }

      return {
        // eslint-disable-next-line object-shorthand
        init: function () {
          const inputs = document.getElementsByClassName('table-filter');
          Arr.forEach.call(inputs, (input) => {
            input.oninput = onInputEvent;
          });
        },
      };
    })();

    TableFilter.init();
    // eslint-disable-next-line prettier/prettier
  }());
}
