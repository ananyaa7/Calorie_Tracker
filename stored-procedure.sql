DELIMITER //
CREATE PROCEDURE FindExerciseType(IN globalUserID INT(20))
BEGIN
    DECLARE currId VARCHAR(20);
    DECLARE avg REAL;
		DECLARE currBMR REAL;
		DECLARE cartCals INT;
    DECLARE done INT DEFAULT 0;
    
    DECLARE cur CURSOR FOR (SELECT healthUserID, AVG(BMI) as avg, BMR, totalOrderCalories 
														FROM health_record JOIN (SELECT * FROM order_record WHERE userID = globalUserID ORDER BY orderID DESC LIMIT 1) as o
														ON healthID = orderHealthID
														GROUP BY healthUserID
														HAVING healthUserID = globalUserID);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    DROP TABLE IF EXISTS RecTable;
    CREATE TABLE RecTable(
				id INT AUTO_INCREMENT,
        userID VARCHAR(20),
        avgBMI REAL,
				exerciseType VARCHAR(50),
				BMR REAL,
				totalOrderCalories INT,
				stat VARCHAR(50),
				PRIMARY KEY (id)
    );
    
    OPEN cur;
    REPEAT
        FETCH cur INTO currId, avg, currBMR, cartCals;
        IF avg < 18.5 THEN
            INSERT IGNORE INTO RecTable(userID, avgBMI, exerciseType, BMR, totalOrderCalories, stat) 
						VALUES (currId, avg, 'Low Intensity', currBMR, cartCals, 0);
        ELSEIF avg > 18.5 AND avg < 24.9 THEN
            INSERT IGNORE INTO RecTable(userID, avgBMI, exerciseType, BMR, totalOrderCalories, stat) 
						VALUES (currId, avg, 'Cardio', currBMR, cartCals, 0);
        ELSE
            INSERT IGNORE INTO RecTable(userID, avgBMI, exerciseType, BMR, totalOrderCalories, stat) 
						VALUES (currId, avg, 'High Intensity', currBMR, cartCals, 0);
        END IF;
    UNTIL done
    END REPEAT;
    CLOSE cur;

    SELECT userID, exerciseType
    FROM RecTable;
END;
//
DELIMITER ;
