document.addEventListener('DOMContentLoaded', () => {
    fetch('/api.data')
        .then(response => response.json())
        .then(data => {

            const container = document.getElementById('data-container');
            const row = document.createElement('div');
            row.className = 'row';

            data.forEach(doc => {
                const col = document.createElement('div');
                col.className = 'col';

                const card = document.createElement('div');
                card.className = 'data-item';

                // Add a delete button to each card
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-btn';
                deleteButton.onclick = function () { deleteData(doc._id); }; // Pass the unique ID to the delete function

                const name = document.createElement('h2');
                name.textContent = doc.name;

                const email = document.createElement('p');
                email.textContent = `Email: ${doc.email}`;

                card.appendChild(deleteButton);
                card.appendChild(name);
                card.appendChild(email);
                col.appendChild(card);
                row.appendChild(col);
            });

            container.appendChild(row);

            // const row = document.createElement('div');
            // row.className = 'row';

            // data.forEach(doc => {
            //     const col = document.createElement('div');
            //     col.className = 'col';

            //     const card = document.createElement('div');
            //     card.className = 'data-item';

            //     const name = document.createElement('h2');
            //     name.textContent = doc.name;

            //     const email = document.createElement('p');
            //     email.textContent = `Email: ${doc.email}`;

            //     card.appendChild(name);
            //     card.appendChild(email);
            //     col.appendChild(card);
            //     row.appendChild(col);
            // });

            // document.getElementById('data-container').appendChild(row);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-data-form');
    form.onsubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submit action

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        // Clear the form fields
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';

        // Send the new data to the server
        const response = await fetch('/add-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name }),
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            // If the insert was successful, refresh the data on the page
            console.log('Data added:', result);
            // You could call a function here to refresh the data displayed on the page
            window.location.reload();
        } else if (response.status === 409) {
            // If the email already exists, alert the user
            alert('Email already exists. Please use a different email.');
        } else {
            console.error('Error adding data:', result);
        }
    };
});

function deleteData(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch('/delete-data', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: [id] })
        })
            .then(response => response.json())
            .then(result => {
                if (result.deletedCount > 0) {
                    // Remove the item from the DOM or refresh the page
                    window.location.reload();
                } else {
                    alert('No item found with te given ID');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}


