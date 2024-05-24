-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2024 at 07:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
('fdju78hf', 'n9q1FJAQ', 'admin', 'pamparor@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$aOe/0CWkQtjHK+B8C2ZClQ$t4HjF8EvCiUqgwLBXh2PNAMPmNpZ5uvY7M/JOpjtie4', 'Rumars', 'Capoquian', 'Pamparos', 'intern');

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
('1500-23BAC', 'fdju78hf', 1, 'test1-bid', 'DANGLI TOPING BUILDERS', '23', '2024-01-31', 'ongoing'),
('1500-26BAC', 'fdju78hf', 1, 'test2-bid', 'DANGLI TOPING BUILDERS', '29761', '2024-05-03', 'ongoing'),
('1600-23BAC', 'fdju78hf', 2, 'test1-alt', 'sad bds', '646168', '2024-02-27', 'ongoing'),
('1600-24BAC', 'fdju78hf', 1, 'SAMPLE TITLE', 'SAMPLE CONTRACTOR', '56', '2024-05-16', 'ongoing'),
('1600-26BAC', 'fdju78hf', 2, 'test2-alt', 'RUMAR PAMPARO', '24339', '2024-02-23', 'ongoing'),
('1700-23BAC', 'fdju78hf', 1, 'test', 'rumarsds', '565', '2024-05-14', 'ongoing'),
('dasds', 'fdju78hf', 1, 'dasdsa', 'dasds', '22', '2024-05-16', 'ongoing');

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
('0MIFozjv', '1500-23BAC', '1500-23BAC_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-05-13'),
('1adai4wa', '1500-26BAC', '1500-26BAC_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-05-14'),
('BHUF7exf', '1600-23BAC', '1600-23BAC_bac_resolution.pdf', '1600-23BAC_notice_of_award.pdf', '1600-23BAC_contract.pdf', '1600-23BAC_notice_to_proceed.pdf', '1600-23BAC_philgeps_award_notice.pdf', '2024-02-23'),
('BntN9EqC', '1700-23BAC', '1700-23BAC_bac_resolution.pdf', '1700-23BAC_notice_of_award.pdf', NULL, NULL, NULL, '2024-05-10'),
('bsWc1OTw', '1600-24BAC', '1600-24BAC_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-05-15'),
('cR25NJIi', 'dasd', 'dasd_bac_resolution.pdf', 'dasd_notice_of_award.pdf', NULL, NULL, NULL, '2024-05-15'),
('dmbDXQHZ', '1600-26BAC', '1600-26BAC_bac_resolution.pdf', '1600-26BAC_notice_of_award.pdf', NULL, NULL, NULL, '2024-03-08'),
('paQYKwmX', 'test', 'test_bac_resolution.pdf', NULL, NULL, NULL, NULL, '2024-05-15'),
('WPQDW0zk', 'dasds', 'dasds_bac_resolution.pdf', 'dasds_notice_of_award.pdf', NULL, NULL, NULL, '2024-05-15');

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
