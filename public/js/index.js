
import {login,logout} from './login'
import {displayMap} from './leaflet'
import '@babel/polyfill'
import { updateSettings } from './updateSettings'

const mapBox=document.getElementById('map')
const logOutBtn=document.querySelector('.nav__el--logout')
if(mapBox){
const locations=JSON.parse(document.getElementById('map').dataset.locations)
displayMap(locations)
}

const userDataForm = document.querySelector('.form-user-data');

const loginForm=document.querySelector('.form--login')


if(loginForm){
document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});
}

if(logOutBtn) logOutBtn.addEventListener('click',logout)

  if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
      e.preventDefault(); // Prevent the default form submission behavior
  
      // Create a new FormData object to send form data, including files
      const form = new FormData();
      form.append('name', document.getElementById('name').value); // Append name
      form.append('email', document.getElementById('email').value); // Append email
  
      // Append the photo file if a file is selected
      const photoFile = document.getElementById('photo').files[0];
      if (photoFile) {
        form.append('photo', photoFile);
      }
  
      // Call the updateSettings function with the form data and a string identifier
      updateSettings(form, 'data');
    });
  }
  


        if (userPasswordForm)
            userPasswordForm.addEventListener('submit', async e => {
              e.preventDefault();
              document.querySelector('.btn--save-password').textContent = 'Updating...';
          
              const passwordCurrent = document.getElementById('password-current').value;
              const password = document.getElementById('password').value;
              const passwordConfirm = document.getElementById('password-confirm').value;
              await updateSettings(
                { passwordCurrent, password, passwordConfirm },
                'password'
              );
          
              document.querySelector('.btn--save-password').textContent = 'Save password';
              document.getElementById('password-current').value = '';
              document.getElementById('password').value = '';
              document.getElementById('password-confirm').value = '';
            });
