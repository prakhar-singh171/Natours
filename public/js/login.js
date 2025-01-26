// Make sure Axios is imported
// If you're using a script tag in HTML, ensure this is added:
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    // Check if login was successful
    console.log(res);
    // Uncomment the following code if the response contains a success status
    // if (res.data.status === 'success') {
    //   showAlert('success', 'Logged in successfully!');
    //   window.setTimeout(() => {
    //     location.assign('/'); // Redirect after login
    //   }, 1500);
    // }

  } catch (err) {
    // Log the error details for debugging
    console.log('Error:', err.response ? err.response.data : err.message);
    // You could also show an alert or display the error message to the user
    // showAlert('error', err.response.data.message);
  }
};

// Handle the form submission
document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
