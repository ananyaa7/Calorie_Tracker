DELIMITER $$

CREATE TRIGGER Trig
AFTER INSERT ON RecTable FOR EACH ROW
BEGIN
    IF NEW.stat != (NEW.BMR - NEW.totalOrderCalories) THEN
        INSERT INTO TriggerResult(userID, stat)
        VALUES(NEW.userID, NEW.BMR - NEW.totalOrderCalories);
    END IF;
END$$

DELIMITER ;
