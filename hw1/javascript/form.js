class Form {
    constructor(
      email,
      password,
      password_confirmation,
      phone_number,
      fname,
      lname,
      age,
      birth_month,
      birth_day,
      birth_year) {}
    // TODO: You may fill in functions in the class.

  }

  var but = document.createElement('button');
  but.innerHTML = "Check";
  but.onclick = function() {
      var email = document.forms["form"]["email"].value;
      // TODO: Fill in the rest of the function. Use the Form class defined above

      var form;

      let alertMessage = '';
      // TODO: Fill the alert message according to the validation result by following the form in README.md.
      alert(alertMessage);

      // Hint: you can use the RegExp class for matching a string with the `test` method.
      // Hint: you can set contents of elements by finding it with `document.getElementById`, and fixing the `innerHTML`.
      // Hint: modify 'title' attribute of each label to display your message
      // Hint: Ask Google to do things you don't know yet! There should be others who have already done what you are to encounter.
  };
  document.body.appendChild(but);