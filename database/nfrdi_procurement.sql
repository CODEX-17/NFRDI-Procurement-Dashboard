-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2024 at 11:31 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nfrdi_procurement`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_accounts`
--

CREATE TABLE `tbl_accounts` (
  `accnt_id` varchar(8) NOT NULL,
  `image_id` varchar(8) NOT NULL,
  `accnt_type` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `first_name` varchar(15) NOT NULL,
  `middle_name` varchar(15) NOT NULL,
  `last_name` varchar(15) NOT NULL,
  `position` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_accounts`
--

INSERT INTO `tbl_accounts` (`accnt_id`, `image_id`, `accnt_type`, `email`, `password`, `first_name`, `middle_name`, `last_name`, `position`) VALUES
('fdju78hf', 'n9q1FJAQ', 'admin', 'pamparor@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$2vT2Zt1Audx+aFzrouzJvQ$vdu9mALZGXGVFNDTPxcheKOMeUqGlrmfnkEVVJKWdgk', 'Rumars', 'Capoquian', 'Pamparos', 'intern');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_images`
--

CREATE TABLE `tbl_images` (
  `image_id` varchar(8) NOT NULL,
  `image_name` varchar(100) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_images`
--

INSERT INTO `tbl_images` (`image_id`, `image_name`, `date`) VALUES
('n9q1FJAQ', 'image1709881840564.png', '2024-03-08');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_details`
--

CREATE TABLE `tbl_project_details` (
  `pr_no` varchar(20) NOT NULL,
  `accnt_id` varchar(8) NOT NULL,
  `type` int(1) NOT NULL,
  `title` varchar(50) NOT NULL,
  `contractor` varchar(50) NOT NULL,
  `contract_amount` varchar(15) NOT NULL,
  `date_published` date NOT NULL,
  `status` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_project_details`
--

INSERT INTO `tbl_project_details` (`pr_no`, `accnt_id`, `type`, `title`, `contractor`, `contract_amount`, `date_published`, `status`) VALUES
('1200-23bac', 'fdju78hf', 1, 'dsadjhbjb689', '561fda', '65465', '2024-02-24', 'ongoing'),
('1200-23badd', 'fdju78hf', 1, 'dsidjwij', 'DFSKFK', '024339', '2024-02-27', 'ongoing'),
('12111-23fav', 'fdju78hf', 2, 'dsalhdikjn', 'sad bds', '646168', '2024-02-27', 'ongoing'),
('1300-24BAC', 'fdju78hf', 1, 'title', 'DASDDWSDBSH', '848422', '2024-03-15', 'ongoing'),
('1500-23BAC', 'fdju78hf', 1, 'Supply of Labor and Materials for the Improvement ', 'DANGLI TOPING BUILDERS', '2,976,154.71', '2024-02-08', 'ongoing'),
('1600-29bac', 'fdju78hf', 1, 'dsadsd2', 'dsads851', '6262', '2026-05-08', 'completed'),
('2322561', 'fdju78hf', 1, 'dasds56d1as51', 'das2d5s6', '5619191', '2024-03-26', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_project_files`
--

CREATE TABLE `tbl_project_files` (
  `file_id` varchar(8) NOT NULL,
  `pr_no` varchar(20) NOT NULL,
  `bac_resolution` varchar(100) DEFAULT NULL,
  `notice_of_award` varchar(100) DEFAULT NULL,
  `contract` varchar(100) DEFAULT NULL,
  `notice_to_proceed` varchar(100) DEFAULT NULL,
  `philgeps_award_notice` varchar(100) DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_project_files`
--

INSERT INTO `tbl_project_files` (`file_id`, `pr_no`, `bac_resolution`, `notice_of_award`, `contract`, `notice_to_proceed`, `philgeps_award_notice`, `date`) VALUES
('2CExOwe3', '1500-23BAC', 'rumar_bac_resolution.pdf', 'dsd_contract.pdf', 'dsd_contract.pdf', 'dsd_notice_of_award.pdf', 'dsd_philgeps_award_notice.pdf', '2024-02-22'),
('4f71Sjsg', 'dsd', 'dsd_bac_resolution.pdf', 'dsd_notice_of_award.', 'dsd_contract.pdf', 'dsd_notice_to_procee', 'dsd_philgeps_award_n', '2024-02-22'),
('73wwHzML', '1600-29bac', '1600-29bac_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-03-08'),
('A6GVEMAO', 'alsjnd521', 'alsjnd521_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-02-23'),
('aS9o7EiQ', 'ssad485', 'ssad485_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-02-23'),
('ayRuB80O', '12111-23fav', NULL, '12111-23fav_notice_of_award.pdf', NULL, NULL, NULL, '2024-02-26'),
('BHUF7exf', '1200-23bac', '1200-23bac_bac_resolution.pdf', '1200-23bac_notice_of_award.pdf', '1200-23bac_contract.pdf', '1200-23bac_notice_to_proceed.pdf', '1200-23bac_philgeps_award_notice.pdf', '2024-02-23'),
('cXFHTRo0', 'sad5sa651', 'sad5sa651_bac_resolution.pdf', 'sad5sa651_notice_of_award.pdf', NULL, NULL, NULL, '2024-02-23'),
('D6iKy2nE', '2322561', NULL, '2322561_notice_of_award.pdf', NULL, NULL, NULL, '2024-03-08'),
('diKLrEdd', 'dsd', 'dsd_bac_resolution.p', 'dsd_notice_of_award.', 'dsd_contract.pdf', 'dsd_notice_to_procee', 'dsd_philgeps_award_n', '2024-02-22'),
('dmbDXQHZ', '1300-24BAC', '1300-24BAC_bac_resolution.pdf', NULL, NULL, '1300-24BAC_notice_to_proceed.pdf', NULL, '2024-03-08'),
('nGkkDPDj', '1200-23badd', '1200-23badd_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-02-26'),
('ouWaXoHI', 'dsad545', 'dsad545_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-02-23'),
('Tr6pJmtY', 'dsd', 'dsd_bac_resolution.p', 'dsd_notice_of_award.', 'dsd_contract.pdf', 'dsd_notice_to_procee', 'dsd_philgeps_award_n', '2024-02-22'),
('TRMqpAoC', '16990', '16990_bac_resolution.pdf', '16990_notice_of_award.pdf', '16990_contract.pdf', '16990_notice_to_proceed.pdf', '16990_philgeps_award_notice.pdf', '2024-02-23'),
('Wi8mB8wj', 'null', 'null_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-02-23'),
('zetg5Ccr', 'dsd', 'dsd_bac_resolution.p', 'dsd_notice_of_award.', 'dsd_contract.pdf', 'dsd_notice_to_procee', 'dsd_philgeps_award_n', '2024-02-22'),
('zKXCf5Z9', 'das6519', 'das6519_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-02-23'),
('ZrJTCs7j', 'dsd', 'dsd_bac_resolution.p', 'dsd_notice_of_award.', 'dsd_contract.pdf', 'dsd_notice_to_procee', 'dsd_philgeps_award_n', '2024-02-22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_accounts`
--
ALTER TABLE `tbl_accounts`
  ADD PRIMARY KEY (`accnt_id`);

--
-- Indexes for table `tbl_images`
--
ALTER TABLE `tbl_images`
  ADD PRIMARY KEY (`image_id`);

--
-- Indexes for table `tbl_project_details`
--
ALTER TABLE `tbl_project_details`
  ADD PRIMARY KEY (`pr_no`);

--
-- Indexes for table `tbl_project_files`
--
ALTER TABLE `tbl_project_files`
  ADD PRIMARY KEY (`file_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
