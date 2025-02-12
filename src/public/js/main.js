const deleteBtns = document.querySelectorAll(".deleteBtn");
const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");
const errorDiv = document.querySelector(".error");
const logoutBtn = document.querySelector("#logout");

logoutBtn?.addEventListener("click", async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  } catch (error) {
    console.error(error);
  }
});

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    errorDiv.textContent = "";
    const formData = new FormData(registerForm);
    const inputData = Object.fromEntries(formData);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(inputData),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(errorResponse.message);
    }

    window.location.href = "/";
  } catch (error) {
    console.log(error ?? "oops");
    errorDiv.textContent = error.message;
  }
});

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    errorDiv.textContent = "";
    const formData = new FormData(loginForm);
    const inputData = Object.fromEntries(formData);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(inputData),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(errorResponse.message);
    }

    window.location.href = "/";
  } catch (error) {
    console.log(error ?? "oops");
    errorDiv.textContent = error.message;
  }
});

const removeVehicle = async (id) => {
  const res = await fetch(`/api/vehicles/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  console.log(data);
};

for (const btn of deleteBtns) {
  btn.addEventListener("click", async () => {
    await removeVehicle(btn.dataset.id);
    location.reload();
  });
}
