"use strict";

const maleButton = document.querySelector("#male-button");
const femaleButton = document.querySelector("#female-button");
const ageInputElement = document.querySelector("#age-input-element");
const weightElement = document.querySelector("#weight-input-element");
const heightElement = document.querySelector("#height-input-element");
let gender;
const outputMaintenanceElement = document.querySelector(
	"#output-maintenance-calories"
);
const outputBMRElement = document.querySelector("#output-BMR-calories");
const activityLevelElement = document.querySelector(
	"#activity-level-input-element"
);

function toggleGender() {
	let activeGender;
	if (maleButton.classList.value.toLowerCase() === "active") {
		activeGender = "male";
	} else activeGender = "female";

	if (activeGender === "male") {
		maleButton.classList.remove("active");
		femaleButton.classList.add("active");
		gender = "female";
	} else {
		femaleButton.classList.remove("active");
		maleButton.classList.add("active");
		gender = "male";
	}
}

function getAge() {
	return Number(ageInputElement.value);
}
function getWeight() {
	return Number(weightElement.value);
}
function getHeight() {
	return Number(heightElement.value);
}
function getActivityLevel() {
	return activityLevelElement.value;
}
function getGender() {
	if (maleButton.classList.value.toLowerCase() === "active") {
		return "male";
	} else return "female";
}

function main() {
	const age = getAge();
	const weight = getWeight();
	const height = getHeight();
	const activityLevel = getActivityLevel();
	const gender = getGender();

	if (!age || !weight || !height) {
		return;
	} else {
		let BMR;
		if (gender === "male") {
			BMR = 10 * weight + 6.25 * height - 5 * age + 5;
		} else {
			BMR = 10 * weight + 6.25 * height - 5 * age - 161;
		}
		console.log(BMR);
		let maintenanceCalories;
		switch (activityLevel) {
			case "sedentary":
				maintenanceCalories = BMR * 1.2;
				break;
			case "lightly-active":
				maintenanceCalories = BMR * 1.375;
				break;
			case "moderately-active":
				maintenanceCalories = BMR * 1.55;
				break;
			case "very-active":
				maintenanceCalories = BMR * 1.725;
				break;
			case "extra-active":
				maintenanceCalories = BMR * 1.9;
				break;
		}
		BMR = Math.round(BMR);
		maintenanceCalories = Math.round(maintenanceCalories);
		outputBMRElement.textContent = `BMR: ${BMR}`;
		outputMaintenanceElement.textContent = `Maintenance Calories: ${maintenanceCalories}`;
	}
}

maleButton.addEventListener("click", toggleGender);
femaleButton.addEventListener("click", toggleGender);
document.addEventListener("keyup", main);
activityLevelElement.addEventListener("change", main);
maleButton.addEventListener("click", main);
femaleButton.addEventListener("click", main);
