// /src/objects/AboutUs.js
import React from 'react';
import styles from '../styles/AboutUs.module.css'; // Assuming you have this CSS module

// Import images
import hasinduImage from '../assets/hasindu.jpg';
import savinduImage from '../assets/savindu.jpg';
import radinImage from '../assets/radin.jpg';

const contributors = [
  {
    name: "Hasindu Sathsara Vithanage",
    studentID: "104824660",
    email: "104824660@student.swin.edu.au",
    image: hasinduImage,
  },
  {
    name: "Savindu Pasandul Wickramasinghe",
    studentID: "104834960",
    email: "104834960@student.swin.edu.au",
    image: savinduImage,
  },
  {
    name: "Radin Senuja Gamage",
    studentID: "104784560",
    email: "104784560@student.swin.edu.au",
    image: radinImage,
  },
];

const AboutUs = () => {
  return (
    <div className={styles.aboutContainer}>
      <h2>About Us</h2>
      <p>Meet our team of contributors:</p>

      <div className={styles.cardsContainer}>
        {contributors.map((contributor, index) => (
          <div key={index} className={styles.card}>
            <img
              src={contributor.image}
              alt={`${contributor.name}`}
              className={styles.image}
            />
            <h3>{contributor.name}</h3>
            <p>Student ID: {contributor.studentID}</p>
            <p>Email: {contributor.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
