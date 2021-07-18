-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 16, 2021 at 06:47 AM
-- Server version: 8.0.25-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restu`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Addr`
--

CREATE TABLE `tbl_Addr` (
  `Addr_Id` varchar(10) NOT NULL,
  `Delivery_Area` varchar(20) NOT NULL,
  `Full_Addr` varchar(100) NOT NULL,
  `Zip_Code` varchar(10) NOT NULL,
  `Landmark` varchar(100) NOT NULL,
  `State` varchar(20) NOT NULL,
  `Delete_Flag` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Admin`
--

CREATE TABLE `tbl_Admin` (
  `Id` int NOT NULL,
  `Username` varchar(20) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `Delete_Flag` varchar(1) DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_Admin`
--

INSERT INTO `tbl_Admin` (`Id`, `Username`, `Password`, `Delete_Flag`) VALUES
(1, 'admin', 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=', 'N');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Cart`
--

CREATE TABLE `tbl_Cart` (
  `Id` int NOT NULL,
  `Firebase_Id` varchar(50) NOT NULL,
  `Menu_Id` varchar(20) NOT NULL,
  `Menu_Qty` int NOT NULL,
  `Created_On` datetime DEFAULT CURRENT_TIMESTAMP,
  `Updated_On` datetime DEFAULT NULL,
  `Delete_Flag` varchar(1) DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Category`
--

CREATE TABLE `tbl_Category` (
  `Cat_Id` varchar(10) NOT NULL,
  `Cat_Name` varchar(100) NOT NULL,
  `Delete_Flag` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_Category`
--

INSERT INTO `tbl_Category` (`Cat_Id`, `Cat_Name`, `Delete_Flag`) VALUES
('BSC1', 'AUSSIE FAVOURITES', 'N'),
('BSC10', 'SEAFOOD DISHES', 'N'),
('BSC11', 'TANDOORI DISHES Served with salad and mint sauce', 'N'),
('BSC12', 'VEGETARIAN DISHES', 'N'),
('BSC2', 'BEEF DISHES', 'N'),
('BSC3', 'BIRIYANI DISHES', 'N'),
('BSC4', 'CHICKEN DISHES', 'N'),
('BSC5', 'CONDIMENTS', 'N'),
('BSC6', 'ENTRÉE', 'N'),
('BSC7', 'LAMB DISHES', 'N'),
('BSC8', 'NAAN BREADS', 'N'),
('BSC9', 'RICE DISHES', 'N');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Config`
--

CREATE TABLE `tbl_Config` (
  `Id` int NOT NULL,
  `Config_Key` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Config_Value` varchar(20) NOT NULL,
  `Delete_Flag` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_Config`
--

INSERT INTO `tbl_Config` (`Id`, `Config_Key`, `Config_Value`, `Delete_Flag`) VALUES
(1, 'delivery_charge_SH', '20', 'N'),
(2, 'delivery_charge_PH', '10', 'N');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Lookup`
--

CREATE TABLE `tbl_Lookup` (
  `Lookup_Cat` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Lookup_Val` varchar(10) NOT NULL,
  `Lookup_Desc` varchar(50) NOT NULL,
  `Delete_Flag` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_Lookup`
--

INSERT INTO `tbl_Lookup` (`Lookup_Cat`, `Lookup_Val`, `Lookup_Desc`, `Delete_Flag`) VALUES
('Country_Code', '61', '+61', 'N'),
('Country_Code', '91', '+91', 'N'),
('Delivery_Area', 'PH', 'Port Headland', 'N'),
('Delivery_Area', 'SH', 'South Headland', 'N'),
('Order_Status', 'A', 'Accepted', 'N'),
('Order_Status', 'C', 'Current', 'N'),
('Order_Status', 'D', 'Delivered', 'N'),
('Order_Status', 'K', 'In the kitchen', 'N'),
('Order_Status', 'U', 'Unaccepted', 'N'),
('Order_Status', 'W', 'On the way', 'N'),
('Order_Type', 'D', 'Delivery', 'N'),
('Order_Type', 'P', 'Pickup', 'N'),
('Payment_Method', 'C', 'Card Payment', 'N'),
('Unacpt_Reason', 'CD', 'Closed for the day', 'N'),
('Unacpt_Reason', 'NA', 'Non serviceable area', 'N'),
('Unacpt_Reason', 'RC', 'Restaurant is closed', 'N');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Menu`
--

CREATE TABLE `tbl_Menu` (
  `Cat_Id` varchar(10) NOT NULL,
  `Menu_Id` varchar(20) NOT NULL,
  `Menu_Name` varchar(100) NOT NULL,
  `Menu_Price` decimal(9,2) NOT NULL,
  `Menu_Desc` varchar(200) DEFAULT NULL,
  `Menu_Type` varchar(10) DEFAULT NULL,
  `Delete_Flag` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_Menu`
--

INSERT INTO `tbl_Menu` (`Cat_Id`, `Menu_Id`, `Menu_Name`, `Menu_Price`, `Menu_Desc`, `Menu_Type`, `Delete_Flag`) VALUES
('BSC1', 'BSM1', 'Perfect Fried Chicken', '19.90', 'Chicken tikka pieces battered & deep fried served with salad and chips', 'non veg', 'N'),
('BSC1', 'BSM2', 'For Kids', '12.90', 'Chicken tikka pieces battered & deep fried served with salad and chips', 'non veg', 'N'),
('BSC1', 'BSM3', 'Golden Fried Fish', '18.90', 'Filet pieces dipped in batter & fried served with salad and chips', 'non veg', 'N'),
('BSC1', 'BSM4', 'For Kids', '8.90', 'Filet pieces dipped in batter & fried served with salad and chips', 'non veg', 'N'),
('BSC1', 'BSM5', 'Basket of Chips', '5.50', '', 'veg', 'N'),
('BSC10', 'BSM62', 'Bombay Fish Curry', '24.90', 'Fillet pieces cooked with potato, coconut cream bengali way', 'non veg', 'N'),
('BSC10', 'BSM63', 'Bombay Fish Bhoona', '24.90', 'Fillet pieces cooked with masala, onion, tomato, capsicum', 'non veg', 'N'),
('BSC10', 'BSM64', 'Bombay Fish Tenga', '24.90', 'Fillet pieces cooked with onion, capsicum, garlic & pickles', 'non veg', 'N'),
('BSC10', 'BSM65', 'Prawn Shagon', '24.90', 'Prawn cutlets cooked with light spices, veggies, coconut sauce', 'non veg', 'N'),
('BSC10', 'BSM66', 'Prawn Jalfrezi', '24.90', 'Prawn cutlets cooked with tomato, onion, capsicum (med hot)', 'non veg', 'N'),
('BSC10', 'BSM67', 'Shrimp Curry ( Cocktail Prawns), Bhoona/Dansak/Korma', '24.90', '', 'non veg', 'N'),
('BSC11', 'BSM68', 'Chicken Tikka', '21.90', 'Chicken breast pieces marinated in yogurt & spices roasted in tandoor', 'non veg', 'N'),
('BSC11', 'BSM69', 'Chicken Tikka Shashlik', '21.90', 'Chicken tikka panfed with onion, tomato, capsicum & light spices', 'non veg', 'N'),
('BSC12', 'BSM70', 'Mixed Vegetable Curry', '18.90', 'Mixed vegetable cooked in spicy gravy', 'veg', 'N'),
('BSC12', 'BSM71', 'Aloo Chholey', '18.90', 'Chickpeas & potato cooked with spices,  onion, tomato and capsicum', 'veg', 'N'),
('BSC12', 'BSM72', 'Vegetable Korma', '18.90', 'Fresh vegetable cooked with spices, fresh cream, dry nuts', 'veg', 'N'),
('BSC12', 'BSM73', 'Mushroom Masala', '18.90', 'Mushroom cooked with tandoor masals, capsicums, onion', 'veg', 'N'),
('BSC12', 'BSM74', 'Bombay Potato', '18.90', 'Potato pieces cooked with spices, onions, chilli, lime juice', 'veg', 'N'),
('BSC12', 'BSM75', 'Tarka Daal', '18.90', 'Yellow lentils cooked with onion, tomato, cumin seeds', 'veg', 'N'),
('BSC12', 'BSM76', 'Bombay Samba', '18.90', 'Fresh vegetables cooked with lentil, spices, herbs, lime juice', 'veg', 'N'),
('BSC12', 'BSM77', 'Saag Aloo', '18.90', 'English spinach & diced potato cooked with herbs & spices', 'veg', 'N'),
('BSC12', 'BSM78', 'Saag Paneer', '18.90', 'English spinach & cottage cheese, cooked with spice', 'veg', 'N'),
('BSC12', 'BSM79', 'Veg Chowmin', '10.20', 'Delicious Chowmin', NULL, 'N'),
('BSC2', 'BSM10', 'Bombay Beef', '21.90', 'Beef pieces cooked with roasted spices & potato', 'non veg', 'N'),
('BSC2', 'BSM11', 'Beef Vindaloo', '21.90', 'Beef pieces cooked with roasted spices & hot sauce (very hot)', 'non veg', 'N'),
('BSC2', 'BSM12', 'Beef Madras', '21.90', 'Beef pieces cooked in hot & sour sauce with methi & coconut', 'non veg', 'N'),
('BSC2', 'BSM13', 'Beef Cholley', '21.90', 'Beef pieces cooked with chickpeas & spices (mild/med/hot)', 'non veg', 'N'),
('BSC2', 'BSM6', 'Beef Rogan Josh', '21.90', 'Beef Pieces cooked with onion capsicum and roasted spices (Medium Hot)', 'non veg', 'N'),
('BSC2', 'BSM7', 'Beef Korma', '21.90', 'Beef peices cooked with light spices and sour cream', 'non veg', 'N'),
('BSC2', 'BSM8', 'Beef Dupiaza', '21.90', 'Beef pieces cooked with tomato, onion, capsicum & roasted spices', 'non veg', 'N'),
('BSC2', 'BSM9', 'Beef Saag', '21.90', 'Beef pieces cooked with english spinach & coconut cream', 'non veg', 'N'),
('BSC3', 'BSM14', 'Vegetable Biriyani', '19.90', 'Mixed vegetables panfried with  basamati rice', 'veg', 'N'),
('BSC3', 'BSM15', 'Chicken/Lamb Biriyani', '24.90', 'Chicken/Lamb pieces panfried with panfried basmati rice', 'non veg', 'N'),
('BSC3', 'BSM16', 'Special Biriyani', '29.90', 'Basamati rice panfried with lamb, chicken & prawn pieces served with omelette', 'non veg', 'N'),
('BSC4', 'BSM17', 'Balti Chicken', '21.90', 'Chicken tikka cooked in gravy spices & tempered with garlic', 'non veg', 'N'),
('BSC4', 'BSM18', 'Chicken Tikka Jalfrezi', '21.90', 'Chicken tikka cooked with tomato, onion, capsicum (medium hot)', 'non veg', 'N'),
('BSC4', 'BSM19', 'Butter Chicken', '21.90', 'Chicken tikka cooked with masala, butter, almond & sauce', 'non veg', 'N'),
('BSC4', 'BSM20', 'Chicken Tikka Masala', '21.90', 'Chicken tikka with capsicum, onion & tandoori masala', 'non veg', 'N'),
('BSC4', 'BSM21', 'Mango Chicken', '21.90', 'Chicken pieces cooked with mango pulp, coconut cream & mustard seed', 'non veg', 'N'),
('BSC4', 'BSM22', 'Chicken Korma', '21.90', 'Chicken breast pieces cooked with light spice & creamy sauce', 'non veg', 'N'),
('BSC4', 'BSM23', 'Chicken Dansak', '21.90', 'Chicken breast pieces cooked with lentil, spicy, sweet & sour sauce', 'non veg', 'N'),
('BSC4', 'BSM24', 'Bombay Chicken Bhoona', '21.90', 'Breast pieces cooked with capsicum, onion & bombay style sauce', 'non veg', 'N'),
('BSC4', 'BSM25', 'Chicken Vindaloo', '21.90', 'Chicken breast pieces cooked in a spicy, hot sauce (very hot)', 'non veg', 'N'),
('BSC4', 'BSM26', 'Chicken Saag', '21.90', 'Breast pieces cooked with spinach & coconut cream sauce', 'non veg', 'N'),
('BSC4', 'BSM27', 'Chicken Madraas', '21.90', 'Chicken pieces in hot & sour sauce with methi leaf & coconut', 'non veg', 'N'),
('BSC5', 'BSM28', 'Cucumber Yogurt', '3.50', '', 'veg', 'N'),
('BSC5', 'BSM29', 'Mixed Pickles', '3.50', '', 'veg', 'N'),
('BSC5', 'BSM30', 'Mango Chutney', '3.50', '', 'veg', 'N'),
('BSC5', 'BSM31', 'Papadums', '3.50', '', 'veg', 'N'),
('BSC6', 'BSM32', 'Mushroom Delight', '9.90', 'Mushrooms marinated & dipped in spicy batter, deep fried', 'veg', 'N'),
('BSC6', 'BSM33', 'Meat Samosa (2)', '7.90', 'Pastry stuffed with spicy lamb mince, deep fried', 'non veg', 'N'),
('BSC6', 'BSM34', 'Vegetable Samosa (2)', '7.90', 'Pastry stuffed with potato & peas,deep fried', 'veg', 'N'),
('BSC6', 'BSM35', 'Onion Bhaji (3)', '7.90', 'Sliced onion mixed with chick peas, flour & spices, deep fried', 'veg', 'N'),
('BSC6', 'BSM36', 'Chilli & Garlic Prawn', '15.90', 'Prawn cutlets marinated in spices and garlic, dipped in spicy batter, deep fried', 'non veg', 'N'),
('BSC6', 'BSM37', 'Chicken Pakura', '9.50', 'Chicken pieces dipped in spicy batter & deep fried ', 'non veg', 'N'),
('BSC6', 'BSM38', 'Fish Pakura', '9.90', 'Fish pieces dipped in spicy batter & deep fried', 'non veg', 'N'),
('BSC6', 'BSM39', 'Chicken Tikka', '10.90', 'Chicken breast pieces marinated in yogurt & spices roasted in tandoor', 'non veg', 'N'),
('BSC6', 'BSM40', 'Chilli & Garlic Chicken', '15.90', 'Chicken cutlets marinated with spices & garlic, dipped in spicy batter then deep fried', 'non veg', 'N'),
('BSC7', 'BSM41', 'Lamb Rogan Josh', '21.90', 'Lamb pieces cooked with onion, capsicum & roasted spices (Medium Hot)', 'non veg', 'N'),
('BSC7', 'BSM42', 'Lamb Korma', '21.90', 'Lamb pieces cooked with light spices and sour cream', 'non veg', 'N'),
('BSC7', 'BSM43', 'Lamb Saag', '21.90', 'Diced lamb pieces cooked with English spinach & coconut cream sauce', 'non veg', 'N'),
('BSC7', 'BSM44', 'Lamb Vindaloo', '21.90', 'Lamb pieces cooked with roasted spices & hot sauce (very hot)', 'non veg', 'N'),
('BSC7', 'BSM45', 'Lamb Dansak', '21.90', 'Lamb pieces cooked in lentils, spicy, sweet & sour sauce', 'non veg', 'N'),
('BSC7', 'BSM46', 'Goat Curry', '21.90', 'Goat pieces with the bone cooked with aromatic spices', 'non veg', 'N'),
('BSC8', 'BSM47', 'Buttered/Plain Naan', '4.50', '', 'veg', 'N'),
('BSC8', 'BSM48', 'Garlic Naan', '5.00', 'Topped with garlic', 'veg', 'N'),
('BSC8', 'BSM49', 'Cheese Naan', '6.00', 'Filled with cheese', 'veg', 'N'),
('BSC8', 'BSM50', 'Peshawari Naan', '6.00', 'Filled with sweet coconut and dried fruits', 'veg', 'N'),
('BSC8', 'BSM51', 'Chilli & Herb Naan', '6.00', '', 'veg', 'N'),
('BSC8', 'BSM52', 'Keema Naan', '6.50', '', 'non veg', 'N'),
('BSC8', 'BSM53', 'Keema & Cheese Naan', '6.50', 'Filled with spicy mince & cheese', 'non veg', 'N'),
('BSC8', 'BSM54', 'Cheese & Garlic Naan', '6.50', '', 'veg', 'N'),
('BSC8', 'BSM55', 'Pizza Naan (Veg)', '7.00', '', 'veg', 'N'),
('BSC8', 'BSM56', 'Pizza Naan (Non-Veg)', '7.50', '', 'non veg', 'N'),
('BSC9', 'BSM57', 'White Basmati Rice', '4.90', '', 'veg', 'N'),
('BSC9', 'BSM58', 'Pulao Rice', '6.90', 'Basmati rice cooked with ghee, onions, cloves & cumin seeds', 'veg', 'N'),
('BSC9', 'BSM59', 'Mushroom Fried Rice', '9.90', '', 'veg', 'N'),
('BSC9', 'BSM60', 'Egg fried Rice', '9.90', '', 'non veg', 'N'),
('BSC9', 'BSM61', 'Geera Rice', '7.90', '', 'veg', 'N');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Order`
--

CREATE TABLE `tbl_Order` (
  `Firebase_Id` varchar(50) NOT NULL,
  `Order_Id` varchar(20) NOT NULL,
  `Order_Status` varchar(1) NOT NULL,
  `Unacpt_Reason` varchar(5) DEFAULT NULL,
  `Order_Type` varchar(1) NOT NULL,
  `Addr_Id` varchar(10) DEFAULT NULL,
  `Phone_No` varchar(12) DEFAULT NULL,
  `Name` varchar(30) DEFAULT NULL,
  `Created_On` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_On` datetime DEFAULT NULL,
  `Delete_Flag` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Order_Det`
--

CREATE TABLE `tbl_Order_Det` (
  `Order_Id` varchar(50) NOT NULL,
  `Menu_Id` varchar(20) NOT NULL,
  `Menu_Qty` int NOT NULL,
  `Menu_Price` decimal(9,2) NOT NULL,
  `Delete_Flag` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Order_Pay`
--

CREATE TABLE `tbl_Order_Pay` (
  `Order_Id` varchar(20) NOT NULL,
  `Pay_Id` varchar(30) NOT NULL,
  `Pay_Type` varchar(30) NOT NULL,
  `Pay_Method` varchar(1) NOT NULL,
  `Pay_Status` varchar(30) NOT NULL,
  `Order_Total` decimal(9,2) NOT NULL,
  `Delivery_Charge` decimal(9,2) DEFAULT NULL,
  `Webhook_Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Created_On` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Restaurant_Timer`
--

CREATE TABLE `tbl_Restaurant_Timer` (
  `Id` int NOT NULL,
  `Month_Ind` int NOT NULL,
  `Monday_Time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Tuesday_Time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Wednesday_Time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Thrusday_Time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Friday_Time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Saturday_Time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Sunday_Time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Created_On` datetime DEFAULT CURRENT_TIMESTAMP,
  `Updated_On` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_Restaurant_Timer`
--

INSERT INTO `tbl_Restaurant_Timer` (`Id`, `Month_Ind`, `Monday_Time`, `Tuesday_Time`, `Wednesday_Time`, `Thrusday_Time`, `Friday_Time`, `Saturday_Time`, `Sunday_Time`, `Created_On`, `Updated_On`) VALUES
(1, 7, '10:00-20:00', '10:00-20:00', '10:00-22:00', '05:00-20:00', '06:00-15:00', '06:00-20:00', '10:00-15:00', '2021-07-02 18:20:26', '2021-07-16 06:46:20'),
(2, 1, '10:00-12:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-18:00', '2021-07-02 18:20:26', '2021-07-05 20:29:00'),
(3, 2, '07:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-15:00', '2021-07-02 18:20:26', NULL),
(4, 3, '07:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-15:00', '2021-07-02 18:20:26', NULL),
(5, 4, '10:00-20:00', '10:00-20:00', '06:00-18:00', '10:00-10:00', '10:00-20:00', '10:00-22:00', '10:00-15:00', '2021-07-02 18:20:26', '2021-07-08 11:34:54'),
(6, 5, '10:00-12:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-18:00', '2021-07-02 18:20:26', '2021-07-05 20:29:00'),
(7, 6, '07:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-15:00', '2021-07-02 18:20:26', NULL),
(8, 8, '07:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-15:00', '2021-07-02 18:20:26', NULL),
(9, 9, '10:00-12:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-18:00', '2021-07-02 18:20:26', '2021-07-05 20:29:00'),
(10, 10, '07:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-15:00', '2021-07-02 18:20:26', NULL),
(11, 11, '10:00-20:00', '10:00-20:00', '06:00-18:00', '10:00-10:00', '10:00-20:00', '10:00-22:00', '10:00-15:00', '2021-07-02 18:20:26', '2021-07-08 11:34:54'),
(12, 12, '07:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-15:00', '10:00-20:00', '10:00-22:00', '10:00-15:00', '2021-07-02 18:20:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_Token`
--

CREATE TABLE `tbl_Token` (
  `Id` int NOT NULL,
  `Firebase_Id` varchar(50) NOT NULL,
  `Refresh_Token` varchar(300) NOT NULL,
  `Created_On` datetime DEFAULT CURRENT_TIMESTAMP,
  `Updated_On` datetime DEFAULT NULL,
  `Delete_Flag` varchar(1) DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_User`
--

CREATE TABLE `tbl_User` (
  `Firebase_Id` varchar(50) NOT NULL,
  `Identification` varchar(100) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Created_On` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Delete_Flag` varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_Cart_Det`
-- (See below for the actual view)
--
CREATE TABLE `vw_Cart_Det` (
`Firebase_Id` varchar(50)
,`Menu_Id` varchar(20)
,`Cat_Id` varchar(10)
,`Menu_Name` varchar(100)
,`Menu_Price` decimal(9,2)
,`Menu_Qty` int
,`Menu_Type` varchar(10)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_Category_Menu`
-- (See below for the actual view)
--
CREATE TABLE `vw_Category_Menu` (
`Cat_Id` varchar(10)
,`Cat_Name` varchar(100)
,`Menu_Id` varchar(20)
,`Menu_Name` varchar(100)
,`Menu_Price` decimal(9,2)
,`Menu_Desc` varchar(200)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_Order_Det`
-- (See below for the actual view)
--
CREATE TABLE `vw_Order_Det` (
`Firebase_Id` varchar(50)
,`Name` varchar(30)
,`Identification` varchar(100)
,`Email` varchar(30)
,`Order_Id` varchar(20)
,`Created_On` datetime
,`Order_Type_Desc` varchar(50)
,`Order_Status_Desc` varchar(50)
,`Delivery_Area_Desc` varchar(50)
,`Order_Status` varchar(1)
,`Order_Type` varchar(1)
,`Order_Total` decimal(9,2)
,`Delivery_Area` varchar(20)
,`Delivery_Charge` decimal(9,2)
,`Full_Addr` varchar(100)
,`Zip_Code` varchar(10)
,`Landmark` varchar(100)
,`State` varchar(20)
,`Menu_Id` varchar(20)
,`Menu_Qty` int
,`Menu_Price` decimal(9,2)
,`Menu_Name` varchar(100)
,`Pay_Method` varchar(1)
,`IsRefund` bigint
);

-- --------------------------------------------------------

--
-- Structure for view `vw_Cart_Det`
--
DROP TABLE IF EXISTS `vw_Cart_Det`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_Cart_Det`  AS  select `tbl_Cart`.`Firebase_Id` AS `Firebase_Id`,`tbl_Cart`.`Menu_Id` AS `Menu_Id`,`tbl_Category`.`Cat_Id` AS `Cat_Id`,`tbl_Menu`.`Menu_Name` AS `Menu_Name`,`tbl_Menu`.`Menu_Price` AS `Menu_Price`,`tbl_Cart`.`Menu_Qty` AS `Menu_Qty`,`tbl_Menu`.`Menu_Type` AS `Menu_Type` from (((`tbl_Cart` join `tbl_Menu` on((`tbl_Cart`.`Menu_Id` = `tbl_Menu`.`Menu_Id`))) join `tbl_Category` on((`tbl_Category`.`Cat_Id` = `tbl_Menu`.`Cat_Id`))) join `tbl_User` on((`tbl_User`.`Firebase_Id` = `tbl_Cart`.`Firebase_Id`))) where ((`tbl_Cart`.`Delete_Flag` = 'N') and (`tbl_Menu`.`Delete_Flag` = 'N') and (`tbl_Category`.`Delete_Flag` = 'N') and (`tbl_User`.`Delete_Flag` = 'N')) ;

-- --------------------------------------------------------

--
-- Structure for view `vw_Category_Menu`
--
DROP TABLE IF EXISTS `vw_Category_Menu`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_Category_Menu`  AS  select `tbl_Category`.`Cat_Id` AS `Cat_Id`,`tbl_Category`.`Cat_Name` AS `Cat_Name`,`tbl_Menu`.`Menu_Id` AS `Menu_Id`,`tbl_Menu`.`Menu_Name` AS `Menu_Name`,`tbl_Menu`.`Menu_Price` AS `Menu_Price`,`tbl_Menu`.`Menu_Desc` AS `Menu_Desc` from (`tbl_Category` join `tbl_Menu` on(((`tbl_Category`.`Cat_Id` = `tbl_Menu`.`Cat_Id`) and (`tbl_Category`.`Delete_Flag` = 'N') and (`tbl_Menu`.`Delete_Flag` = 'N')))) ;

-- --------------------------------------------------------

--
-- Structure for view `vw_Order_Det`
--
DROP TABLE IF EXISTS `vw_Order_Det`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_Order_Det`  AS  select distinct `tbl_User`.`Firebase_Id` AS `Firebase_Id`,`tbl_Order`.`Name` AS `Name`,`tbl_User`.`Identification` AS `Identification`,`tbl_User`.`Email` AS `Email`,`tbl_Order`.`Order_Id` AS `Order_Id`,`tbl_Order`.`Created_On` AS `Created_On`,(select `tbl_Lookup`.`Lookup_Desc` from `tbl_Lookup` where ((`tbl_Lookup`.`Lookup_Cat` = 'Order_Type') and (`tbl_Lookup`.`Lookup_Val` = `tbl_Order`.`Order_Type`) and (`tbl_Lookup`.`Delete_Flag` = 'N'))) AS `Order_Type_Desc`,(select `tbl_Lookup`.`Lookup_Desc` from `tbl_Lookup` where ((`tbl_Lookup`.`Lookup_Cat` = 'Order_Status') and (`tbl_Lookup`.`Lookup_Val` = `tbl_Order`.`Order_Status`) and (`tbl_Lookup`.`Delete_Flag` = 'N'))) AS `Order_Status_Desc`,(select `tbl_Lookup`.`Lookup_Desc` from `tbl_Lookup` where ((`tbl_Lookup`.`Lookup_Cat` = 'Delivery_Area') and (`tbl_Lookup`.`Lookup_Val` = `tbl_Addr`.`Delivery_Area`) and (`tbl_Lookup`.`Delete_Flag` = 'N'))) AS `Delivery_Area_Desc`,`tbl_Order`.`Order_Status` AS `Order_Status`,`tbl_Order`.`Order_Type` AS `Order_Type`,`tbl_Order_Pay`.`Order_Total` AS `Order_Total`,`tbl_Addr`.`Delivery_Area` AS `Delivery_Area`,`tbl_Order_Pay`.`Delivery_Charge` AS `Delivery_Charge`,`tbl_Addr`.`Full_Addr` AS `Full_Addr`,`tbl_Addr`.`Zip_Code` AS `Zip_Code`,`tbl_Addr`.`Landmark` AS `Landmark`,`tbl_Addr`.`State` AS `State`,`tbl_Order_Det`.`Menu_Id` AS `Menu_Id`,`tbl_Order_Det`.`Menu_Qty` AS `Menu_Qty`,`tbl_Order_Det`.`Menu_Price` AS `Menu_Price`,`tbl_Menu`.`Menu_Name` AS `Menu_Name`,`tbl_Order_Pay`.`Pay_Method` AS `Pay_Method`,(select count(`tbl_Order_Pay`.`Pay_Status`) from `tbl_Order_Pay` where ((`tbl_Order_Pay`.`Order_Id` = `tbl_Order`.`Order_Id`) and (`tbl_Order_Pay`.`Pay_Type` = 'refund') and ((`tbl_Order_Pay`.`Pay_Status` = 'succeeded') or (`tbl_Order_Pay`.`Pay_Status` = 'pending')))) AS `IsRefund` from (((((`tbl_Order` join `tbl_Order_Det` on((`tbl_Order`.`Order_Id` = `tbl_Order_Det`.`Order_Id`))) join `tbl_Order_Pay` on(((`tbl_Order_Pay`.`Order_Id` = `tbl_Order`.`Order_Id`) and (`tbl_Order_Pay`.`Pay_Type` in ('charge','payment_intent')) and (`tbl_Order_Pay`.`Pay_Status` = 'succeeded')))) join `tbl_Menu` on((`tbl_Menu`.`Menu_Id` = `tbl_Order_Det`.`Menu_Id`))) join `tbl_User` on((`tbl_User`.`Firebase_Id` = `tbl_Order`.`Firebase_Id`))) left join `tbl_Addr` on(((`tbl_Order`.`Addr_Id` = `tbl_Addr`.`Addr_Id`) and (`tbl_Addr`.`Delete_Flag` = 'N')))) where ((`tbl_Order`.`Delete_Flag` = 'N') and (`tbl_Order_Det`.`Delete_Flag` = 'N') and (`tbl_User`.`Delete_Flag` = 'N')) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_Addr`
--
ALTER TABLE `tbl_Addr`
  ADD PRIMARY KEY (`Addr_Id`);

--
-- Indexes for table `tbl_Admin`
--
ALTER TABLE `tbl_Admin`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tbl_Cart`
--
ALTER TABLE `tbl_Cart`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tbl_Category`
--
ALTER TABLE `tbl_Category`
  ADD PRIMARY KEY (`Cat_Id`);

--
-- Indexes for table `tbl_Config`
--
ALTER TABLE `tbl_Config`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tbl_Lookup`
--
ALTER TABLE `tbl_Lookup`
  ADD PRIMARY KEY (`Lookup_Cat`,`Lookup_Val`);

--
-- Indexes for table `tbl_Menu`
--
ALTER TABLE `tbl_Menu`
  ADD PRIMARY KEY (`Cat_Id`,`Menu_Id`);

--
-- Indexes for table `tbl_Order`
--
ALTER TABLE `tbl_Order`
  ADD PRIMARY KEY (`Order_Id`);

--
-- Indexes for table `tbl_Order_Pay`
--
ALTER TABLE `tbl_Order_Pay`
  ADD PRIMARY KEY (`Order_Id`,`Pay_Id`,`Pay_Status`,`Webhook_Name`);

--
-- Indexes for table `tbl_Restaurant_Timer`
--
ALTER TABLE `tbl_Restaurant_Timer`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tbl_Token`
--
ALTER TABLE `tbl_Token`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tbl_User`
--
ALTER TABLE `tbl_User`
  ADD PRIMARY KEY (`Firebase_Id`,`Identification`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_Admin`
--
ALTER TABLE `tbl_Admin`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_Cart`
--
ALTER TABLE `tbl_Cart`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_Config`
--
ALTER TABLE `tbl_Config`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_Restaurant_Timer`
--
ALTER TABLE `tbl_Restaurant_Timer`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_Token`
--
ALTER TABLE `tbl_Token`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
