/*********************************************************************************
 * WEB422 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Daryan Chan  Student ID: 113973192  Date: June 9, 2020
 *
 *
 ********************************************************************************/

let saleData = [];
let page = 1;
const perPage = 10;
const saleTableTemplate = _.template(`
        <% _.forEach(Sales, function(sale) { %>
            <tr data-id="<%- sale._id %>">
                <td><%- sale.customer.email %></td>
                <td><%- sale.storeLocation %></td>
                <td><%- sale.items.length %></td>
                <td><%- moment.utc(sale.saleDate).local().format('LLLL') %></td>
            </tr>
        <% }); %>
`);

const saleModalBodyTemplate = _.template(`
        <h4>Customer</h4>
        <strong>email:</strong> <%= customer.email %><br>
        <strong>age:</strong> <%= customer.age %><br>
        <strong>satisfaction:</strong> <%= customer.satisfaction %> / 5
        <br></br>
        <h4>Items: $<%= total.toFixed(2) %></h4>
        <table class="table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <% _.forEach(items, function(item) { %>
                    <tr>
                        <td><%- item.name %></td>
                        <td><%- item.quantity %></td>
                        <td>$<%- item.price.toFixed(2) %></td>
                    </tr>
                <% }); %>
            </tbody>
        </table>
`);

function loadSaleData() {
    fetch(`https://salty-citadel-40883.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`)
        .then((response) => response.json())
        .then((json) => {
            saleData = json;
            let saleTable = saleTableTemplate(saleData);
            $('#sale-table tbody').html(saleTable);
            $('#current-page').html(page);
        });
}

$(function () {
    loadSaleData();
    $('#sale-table tbody').on('click', 'tr', function (e) {
        let clickedRowId = $(this).attr('data-id');
        let clickedSale = _.find(saleData.Sales, { _id: clickedRowId });
        let total = 0;
        _.forEach(clickedSale.items, function (o) {
            total += o.price * o.quantity;
        });
        clickedSale.total = total;
        $('#sale-modal .modal-header').html(`<h4>Sale: ${clickedRowId}</h4>`);
        $('#sale-modal .modal-body').html(saleModalBodyTemplate(clickedSale));
        $('#sale-modal').modal();
    });

    $('#previous-page').on('click', function (e) {
        if (page > 1) {
            page--;
            loadSaleData();
        }
    });

    $('#next-page').on('click', function (e) {
        page++;
        loadSaleData();
    });
});
