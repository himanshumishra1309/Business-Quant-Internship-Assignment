$(function() {
    $('.select2').select2();

    var table;

    $.getJSON('data.json', function(data) {
        table = $('#example').DataTable({
            data: data,
            columns: [
                { data: 'company' },
                { data: 'ticker', defaultContent: '' },
                { data: 'Sector', defaultContent: '' },
                { data: 'Industry', defaultContent: '' },
                { data: 'revenue', defaultContent: '' },
                { data: 'gp', defaultContent: '' },
                { data: 'fcf', defaultContent: '' },
                { data: 'capex', defaultContent: '' }
            ],
            responsive: true,
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            autoWidth: false
        });

        $('.toggle-column').on('change', function() {
            var column = table.column($(this).attr('data-column'));
            column.visible(!column.visible());
        });

        function applyFilters() {
            $.fn.dataTable.ext.search.length = 0;

            $('.filter-container').each(function() {
                var criteria = $(this).find('#criteria').val();
                var condition = $(this).find('#condition').val();
                var value = parseFloat($(this).find('#value').val()) || 0;
                var unit = parseFloat($(this).find('#unit').val()) || 1;

                value *= unit;

                var criteriaMapping = {
                    'revenue': 4,
                    'gp': 5,
                    'fcf': 6,
                    'capex': 7
                };

                var columnIndex = criteriaMapping[criteria];

                $.fn.dataTable.ext.search.push(function(settings, data) {
                    var columnValue = parseFloat(data[columnIndex]) || 0;

                    switch (condition) {
                        case 'lt': return columnValue < value;
                        case 'gt': return columnValue > value;
                        case 'lte': return columnValue <= value;
                        case 'gte': return columnValue >= value;
                        case 'eq': return columnValue == value;
                        default: return true;
                    }
                });
            });

            table.draw();
        }

        $(document).on('click', '#applyFilter', applyFilters);

        $('.add-content').on('click', function() {
            var newFilter = `
                <div class="filter-container">
                    <select id="criteria" class="select2">
                        <option value="revenue">Revenue</option>
                        <option value="gp">GP</option>
                        <option value="fcf">FCF</option>
                        <option value="capex">Capex</option>
                    </select>
                    <select id="condition" class="select2">
                        <option value="lt">Less Than</option>
                        <option value="gt">Greater Than</option>
                        <option value="lte">Less Than or Equal to</option>
                        <option value="gte">Greater Than or Equal to</option>
                        <option value="eq">Equal to</option>
                    </select>
                    <input type="number" id="value" placeholder="Value">
                    <select id="unit" class="select2">
                        <option value="1">One</option>
                        <option value="1000">Thousand</option>
                        <option value="1000000">Million</option>
                        <option value="1000000000">Billion</option>
                        <option value="1000000000000">Trillion</option>
                    </select>
                    <button id="applyFilter">Apply Filter</button>
                    <i class="fa fa-times fa-2x remove-content" style="color: red;"></i>
                </div>`;
            $(newFilter).insertBefore('.add-content');
            $('.select2').select2();
        });

        $(document).on('click', '.remove-content', function() {
            $(this).closest('.filter-container').remove();
            applyFilters();
        });
    });
});
