-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql313.infinityfree.com
-- Generation Time: Aug 10, 2025 at 05:35 AM
-- Server version: 11.4.7-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_38581364_gaming_website_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(7, 'VAIBHAV BABELE', 'vaibhav@gmail.com', '$2y$10$lQ8rpu.m74FvwqX7PIEqz.Fh1xQCIIC5rBrg/LbfI5X1bNK1ToqU.', '2025-03-23 06:07:17'),
(8, 'SAURABH  YADAV', 'Saurabhfuture123@gmail.com', '$2y$10$IQTAz0O0De6IPjFMmsSx3eLFB6cJR6G18fs5snV6sEPLn1KSCJxg.', '2025-04-01 13:16:54');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `notice` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `notice`, `created_at`) VALUES
(4, 'ðŸ“¢ Announcement: Sports Fest 2025 Team Registration ðŸ“¢  \r\n\r\nAll Team Captains participating in Sports Fest 2025 (April 2 - April 5) are required to register their teams with the following details:  \r\nâœ… Captain Name  \r\nâœ… Vice-Captain Name\r\nâœ… Player Names\r\nâœ… Team Logo (if available)  \r\nDeadline: Complete the registration before the due date to confirm participation.  \r\nFor any issues or assistance, contact:  \r\nðŸ“ž Vaibhav, 3rd Year CSE\r\nðŸ“§ Administrator of Website \r\nðŸ“² Contact No.: 8417054915\r\nHurry up and register now to secure your spot! ðŸŽ¯', '2025-03-27 07:14:23');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `user_id`, `title`, `content`, `status`, `created_at`, `display_order`) VALUES
(8, 28, 'About Sports Fest', 'A Sports Fest in college is an exciting event where students participate in various sports and athletic competitions. It promotes teamwork, school spirit, and physical fitness while offering a break from academic routines.\r\n\r\nKey Highlights of a College Sports Fest\r\nOpening Ceremony â€“ Usually includes a parade, torch lighting, and an oath-taking ceremony for fair play.\r\n\r\nSports Events â€“ Includes team sports (e.g., kho-kho, volleyball, cricket), individual sports (e.g., badminton, chess, table tennis).\r\n\r\n\r\n\r\nCultural Programs â€“ Dance performances, cheerleading competitions, and musical acts often accompany the fest.\r\n\r\nAwarding Ceremony â€“ Winners receive medals, trophies, or certificates to recognize their achievements.\r\n\r\nBenefits of a Sports Fest\r\nEncourages teamwork and leadership\r\n\r\nPromotes physical fitness and well-being\r\n\r\nProvides a platform to showcase talent\r\n\r\nStrengthens friendships and social interactions\r\n\r\nReduces stress and improves mental health', 'approved', '2025-03-23 06:05:47', 0);

-- --------------------------------------------------------

-- ...existing code...

