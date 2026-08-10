-- Clear unpaid featured placement until a company purchases it
UPDATE companies SET featured = 0 WHERE featured = 1;
