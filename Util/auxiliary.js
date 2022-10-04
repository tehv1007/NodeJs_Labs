exports.calculateSalary = (month, staff) => {
    const year = 2022;
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    let overTime = 0;
    let shortTime = 0;
    const listDayLeave = [];

    // get leave date
    staff.leaveInfoList.forEach((leaveInfo) => {
        const dayLeave = {};
        const dayStartLeave = leaveInfo.startLeaveDay;
        const dayEndLeave = leaveInfo.startLeaveDay;
        const timesLeave = leaveInfo.timeLeave;

        dayLeave.dayStartLeave = dayStartLeave.getDate();
        dayLeave.dayEndLeave = dayEndLeave.getDate();
        dayLeave.monthLeave = dayStartLeave.getMonth();
        dayLeave.time = timesLeave;
        return listDayLeave.push(dayLeave);
    });

    // get over time and short time;
    for (let i = 1; i <= lastDayOfMonth; i++) {
        let timeWorkInDay = 0;
        let timeAnnualLeave = 0;

        overTime += timeWorkInDay - 8 < 0 ? 0 : timeWorkInDay - 8;
        shortTime +=
            8 - (timeWorkInDay + timeAnnualLeave) < 0
                ? 0
                : 8 - (timeWorkInDay + timeAnnualLeave);

        staff.workTimes.forEach((workTime) => {
            if (
                workTime.startTime.getDate() == i &&
                workTime.startTime.getMonth() + 1 == month
            ) {
                listDayLeave.forEach((day) => {
                    const hoursStart = workTime.startTime.getHours();
                    const hoursEnd = workTime.endTime.getHours();
                    const timeStart = hoursStart * 60 + workTime.startTime.getMinutes();
                    const timeEnd = hoursEnd * 60 + workTime.endTime.getMinutes();
                    // plus time leave to timework
                    if (
                        day.dayStartLeave <= workTime.startTime.getDate() &&
                        day.dayEndLeave >= workTime.startTime.getDate() &&
                        day.monthLeave + 1 == month
                    ) {
                        timeAnnualLeave = day.timesLeave;
                    }
                    timeWorkInDay += (timeEnd - timeStart) / 60;
                });
            }
        });
    }
    return staff.salaryScale * 3000000 + (overTime - shortTime) * 200000;
};

// Tính toán tổng thời gian làm việc trong 1 ngày
exports.calculateTimeWorked = (staff) => {
    let totalTimeWorked = 0;
    const workTimeInDay = [];
    const WorkTimesLength = staff.workTimes.length;
    let day = staff.workTimes[WorkTimesLength - 1].startTime.getDate();

    // find list worktime in a day
    staff.workTimes.forEach((workTime) => {
        if (day === workTime.startTime.getDate()) {
            workTimeInDay.push(workTime);
        }
        return workTimeInDay;
    });

    workTimeInDay.forEach((workTime) => {
        // calculate minutes work
        const minutesStart =
            workTime.startTime.getHours() * 60 + workTime.startTime.getMinutes();
        const minutesEnd = workTime.endTime.getHours() * 60 + workTime.endTime.getMinutes();
        const minustesCalculate = (minutesEnd - minutesStart) / 60;

        // calculate Hours work
        const hoursWorked = workTime.endTime.getHours() - workTime.startTime.getHours();
        return (totalTimeWorked += (hoursWorked * 60 + minustesCalculate).toFixed(2));
    });

    return totalTimeWorked;
};