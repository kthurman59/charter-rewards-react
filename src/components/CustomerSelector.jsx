import React from "react";

function CustomerSelector({ customers, selectedCustomerId, onChange }) {
  return (
    <section className="rewards-dashboard__controls">
      <label htmlFor="customer-select">Customer</label>{" "}
      <select
        id="customer-select"
        value={selectedCustomerId ?? ""}
        onChange={onChange}
      >
        <option value="">All customers</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
    </section>
  );
}

export default CustomerSelector;

