document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Call the backend API to authenticate user
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.token) {
        // If successful login, store the JWT token
        localStorage.setItem("token", data.token);

        // Hide login form and show logout button
        document.getElementById("sign-in-sign-up").style.display = "none";
        document.getElementById("sign-out-section").style.display = "block";

        // Check if the user is active
        updateUserStatus();
    } else {
        // Show error message
        alert(data.message);
    }
});

// Check user status (active or inactive)
async function updateUserStatus() {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    const response = await fetch("/api/status", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    const statusElement = document.getElementById("auth-status");
    if (data.active) {
        statusElement.textContent = "Active";
        statusElement.style.color = "green";
    } else {
        statusElement.textContent = "Inactive";
        statusElement.style.color = "red";
    }
}

// Log out functionality
document.getElementById("logout-button").addEventListener("click", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You are not logged in.");
        return;
    }

    // Call API to log out user (invalidate the JWT)
    await fetch("/api/logout", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    // Clear the session token from local storage
    localStorage.removeItem("token");

    // Hide logout button and show login form again
    document.getElementById("sign-in-sign-up").style.display = "block";
    document.getElementById("sign-out-section").style.display = "none";

    alert("You have been logged out.");
});

// Function to handle dietary preference search
function searchPreferences() {
    const dietaryInput = document.getElementById('dietary-preference').value;
    console.log(`Searching for restaurants with dietary preference: ${dietaryInput}`);

    const restaurantData = [
        { name: "Vegan Bistro", type: "Vegan", location: "123 Plant St" },
        { name: "Gluten-Free Bakery", type: "Gluten-Free", location: "456 Grain Ave" }
    ];

    displayRestaurants(restaurantData);
}

// JavaScript for redirecting when logo is clicked
document.getElementById("logo-link").addEventListener("click", function (event) {
    event.preventDefault(); // Prevents the default anchor click action
    window.location.href = '/'; // Redirects to the home page
});

// Function to display restaurants on the page
function displayRestaurants(data) {
    const restaurantList = document.getElementById('restaurant-list');
    restaurantList.innerHTML = '';

    data.forEach(restaurant => {
        const listItem = document.createElement('li');
        listItem.textContent = `${restaurant.name} - ${restaurant.type} (${restaurant.location})`;
        restaurantList.appendChild(listItem);
    });
}

// Function to share a recipe
function shareRecipe(event) {
    event.preventDefault();
    const recipeName = document.getElementById('recipe-name').value;
    const recipeInstructions = document.getElementById('recipe-instructions').value;

    console.log(`Sharing recipe: ${recipeName}`);

    const sharedRecipeList = document.getElementById('shared-recipe-list');
    const recipeItem = document.createElement('li');
    recipeItem.textContent = `${recipeName}: ${recipeInstructions}`;
    sharedRecipeList.appendChild(recipeItem);

    document.getElementById('share-recipe-form').reset();
}

// Existing functionalities for login, logout, user status, and restaurant display remain the same...

// Initialize Google Maps with enhanced functionality
function initMap() {
    // Create the map and set initial options
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 40.280, lng: -74.006 }, // Default center coordinates (you can change this)
        mapTypeControl: true,
        streetViewControl: true,
    });

    // Add a marker at the center (for default center)
    const marker = new google.maps.Marker({
        position: { lat: 40.280, lng: -74.006 },
        map: map,
        title: "Example Location"
    });

    // Add an info window to the marker
    const infoWindow = new google.maps.InfoWindow({
        content: '<h3>Example Location</h3><p>This is a default location.</p>',
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    // Center the map on the user's location if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Move the map center to the user's location
                map.setCenter(userLocation);

                // Add a marker for the user's location
                const userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location',
                });

                // Add an info window for the user's location
                const userInfoWindow = new google.maps.InfoWindow({
                    content: '<h3>Your Location</h3><p>This is where you are currently located.</p>',
                });

                // Open the info window when the user clicks on the user’s marker
                userMarker.addListener('click', () => {
                    userInfoWindow.open(map, userMarker);
                });
            },
            () => {
                console.error('Geolocation failed');
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
    // Restaurant data
    const restaurants = [
        {
            name: "Atillo Pizzeria",
            lat: 40.27030,
            lng: -74.01519,
            address: "67 Monmouth Rd, Oakhurst, NJ 07755",
            cuisine: "Italian",
            rating: 4.0,
            phone: "(732)-222-5655",
            details: "This is a description of Example Restaurant 1."
        },
        {
            name: "Gianni's Pizzeria",
            lat: 40.27084,
            lng: -74.01605,
            address: "56 Monmouth Rd, Oakhurst, NJ 07755",
            cuisine: "Italian",
            rating: 4.5,
            phone: "(732)-728-7004",
            details: "-Pizzeria <br> -Vegeterian Options"
        },
        {
            name: "Puerto Escondido",
            lat: 40.29436,
            lng: -74.02842,
            address: "175 Monmouth Rd Unit 1, West Long Branch, NJ 07764",
            cuisine: "Mexican",
            rating: 4.5,
            phone: "(732)-272-1584",
            details: "This is a description of Example Restaurant 3."
        },
        {
            name: "Gigi's NY Style Pizza and Restaurant",
            lat: 40.28441,
            lng: -73.98842,
            address: "140 Brighton Ave, Long Branch, NJ 07740",
            cuisine: "Italian",
            rating: 4.5,
            phone: "(732)-377-2468",
            details: "This is a description of Example Restaurant 4."
        },
        {
            name: "Mi Pueblo Querido Mexican",
            lat: 40.30018,
            lng: -74.00082,
            address: "551 Broadway, Long Branch, NJ 07740",
            cuisine: "Mexican",
            rating: 5.0,
            phone: "(732)-483-6606",
            details: "This is a description of Example Restaurant 5."
        },
        {
            name: "Chick-fil-A",
            lat: 40.25374,
            lng: -74.03933,
            address: "1613 State Highway 35, Oakhurst, NJ 07755",
            cuisine: "Fast Food",
            rating: 5.0,
            phone: "(732)-769-4232",
            details: "This is a description of Example Restaurant 6."
        },
    ];

    // Create and add markers for each restaurant
    restaurants.forEach(restaurant => {
        const marker = new google.maps.Marker({
            position: { lat: restaurant.lat, lng: restaurant.lng },
            map: map,
            title: restaurant.name,
        });

        // Create info window for the restaurant
        const infoWindow = new google.maps.InfoWindow({
            content: `<h3>${restaurant.name}</h3><p>${restaurant.details}</p>`,
        });

        // Open the info window when the user clicks on the marker
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        // Show the info window when the user hovers over the marker
        marker.addListener('mouseover', () => {
            infoWindow.open(map, marker);
        });

        // Optionally, close the info window when the user stops hovering over the marker
        marker.addListener('mouseout', () => {
            infoWindow.close();
        });
        marker.addListener('click', () => {
            // Open the info window when the marker is clicked
            infoWindow.open(map, marker);

            // Update the detailed information below the map
            document.getElementById('restaurant-name').textContent = `Name: ${restaurant.name}`;
            document.getElementById('restaurant-address').textContent = `Address: ${restaurant.address}`;
            document.getElementById('restaurant-cuisine').textContent = `Cuisine: ${restaurant.cuisine}`;
            document.getElementById('restaurant-rating').textContent = `Rating: ${restaurant.rating}`;
            document.getElementById('restaurant-phone').textContent = `Phone: ${restaurant.phone}`;
            document.getElementById('restaurant-description').textContent = `Description: ${restaurant.description}`;
        });
    });


    // Add a search box for finding locations
    const input = document.createElement('input');
    input.setAttribute('id', 'pac-input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Search for restaurants...');
    document.getElementById('map-container').appendChild(input);

    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the search box results towards the current map's viewport
    map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        // Clear out existing markers
        marker.setMap(null);

        // Fit map bounds to show all found places
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (!place.geometry) return;

            new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
            });
            bounds.extend(place.geometry.location);
        });
        map.fitBounds(bounds);
    });

    // Center the map on the user's location if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userLocation);
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location',
                });
            },
            () => {
                console.error('Geolocation failed');
            }
        );
    }
}

// Ensure existing event listeners remain intact
document.getElementById('search-button').addEventListener('click', searchPreferences);
document.getElementById('share-recipe-form').addEventListener('submit', shareRecipe);
