const https = require('https');
const { parse } = require('path');

//Helper function for fetching data from API
function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res=> {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
            res.on('error', reject);
        });
    });
}

//Helper function for calculating cart total value
function calculateCartTotal(cart, productData) {
    const products = cart.products;
    const total = products.reduce((acc, curr) => {
        const product = productData.find((p) => p.id === curr.productId);
        return acc + product.price * curr.quantity;
    }, 0);
    return total;
}

//Helper function for calculating distance based on latitude and longitude
function degToRad(deg){
    return deg * (Math.PI/180);
}

function calculateDistance(geo1, geo2) {
    const [lat1, lng1] = Object.values(geo1).map(parseFloat);
    const [lat2, lng2] = Object.values(geo2).map(parseFloat);
    const earthRadius = 6371; // in kilometers
    const dLat = degToRad(lat2 - lat1);
    const dLng = degToRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  }

//Retrieving user, product and shopping cart data
Promise.all([
    fetchData('https://fakestoreapi.com/users'),
    fetchData('https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07'),
    fetchData('https://fakestoreapi.com/products'),
]).then(([users, carts, products]) => {
    //Creating a data structure containing all available product categories and the total value of products of a given category
    const categories = {};
    products.forEach(product => {
        if (product.category in categories) {
            categories[product.category] += product.price;
        } else {
            categories[product.category] = product.price;
        }
    });
    console.log('Categories & Total Value: \n', categories);

    //Finding a cart with the highest value, determining its value and full name of its owner
    let highestVal = 0;
    let ownerName = '';
    carts.forEach(cart => {
        const totalVal = calculateCartTotal(cart, products);
        if (totalVal > highestVal) {
            highestVal = totalVal;
            const owner = users.find(user => user.id === cart.userId);
            ownerName = owner.name.firstname + ' ' + owner.name.lastname;
        }
    });
    console.log('Highest value found: ', highestVal);
    console.log('Name of the owner: ', ownerName);

    // Finding two users living furthest away from each other
    let furthestDistance = 0;

    let furthestUsers = [];
    users.forEach((user1, i) => {
    users.slice(i + 1).forEach(user2 => {
      const distance = calculateDistance(user1.address.geolocation, user2.address.geolocation);
      if (distance > furthestDistance) {
        furthestDistance = distance;
        furthestUsers = [user1, user2];
      }
    });
  });
  console.log('Biggest distance: ', furthestDistance);
  console.log('Furthest users: ', furthestUsers.map(user => `${user.name.firstname} ${user.name.lastname}`));
})

module.exports = {
    calculateCartTotal,
    calculateDistance,
    degToRad,
};