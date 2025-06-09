package com.chinatower.wetland.util;

import cn.hutool.core.date.DateUtil;
import com.chinatower.wetland.pojo.param.TimeListParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

/**
 * 获取  当前年、半年、季度、月、日、小时 开始结束时间
 */
public class RemindDateUtils {
    private static final Logger log = LoggerFactory.getLogger(RemindDateUtils.class);

    static final String YEAR_MONTH_DAY = "yyyy-MM-dd";
    static final String YEAR_MONTH = "yyyy-MM";
    static final String YEAR_MONTH_DAY_HOUR = "yyyy-MM-dd HH";
    static final String YEAR_MONTH_DAY_ALL = "yyyy-MM-dd HH:mm:ss";

    static final String START_TIME = " 00:00:00";
    static final String END_TIME = " 23:59:59";


    public  SimpleDateFormat SHORT_SDF = new SimpleDateFormat(YEAR_MONTH_DAY);
    public  SimpleDateFormat SHORT_2_SDF = new SimpleDateFormat(YEAR_MONTH);
    public  SimpleDateFormat LONG_HOUR_SDF = new SimpleDateFormat(YEAR_MONTH_DAY_HOUR);
    public  SimpleDateFormat LONG_SDF = new SimpleDateFormat(YEAR_MONTH_DAY_ALL);


    /**
     * 根据参数 获取  当前年、季度、月、周、日开始结束时间
     *
     * @param type 可传 day、week、month、quarter、year
     * @return date[0]开始时间 date[1]结束时间
     */
    public static synchronized Date[] getTimeByParam(String type) {
        Date[] date = new Date[2];
        if (Objects.nonNull(type)) {
            switch (type) {
                case "day":
                    date = new Date[]{getCurrentDayStartTime(), getCurrentDayEndTime()};
                    break;
                case "week":
                    date = new Date[]{getCurrentWeekDayStartTime(), getCurrentWeekDayEndTime()};
                    break;
                case "month":
                    date = new Date[]{getCurrentMonthStartTime(), getCurrentMonthEndTime()};
                    break;
                case "quarter":
                    date = new Date[]{getCurrentQuarterStartTime(), getCurrentQuarterEndTime()};
                    break;
                case "year":
                    date = new Date[]{getCurrentYearStartTime(), getCurrentYearEndTime()};
                    break;
                case "yesterday":
                    date = new Date[]{getCurrentYesterdayStartTime(), getCurrentYesterdayEndTime()};
                    break;
                default:
                    log.error("不支持该时间范围:{}", type);
                    break;
            }
        }
        return date;
    }

    /**
     * 获得本周的第一天，周一
     *
     * @return DATE
     */
    public static Date getCurrentWeekDayStartTime() {
        Calendar cal = Calendar.getInstance();
        try {

            cal.setFirstDayOfWeek(Calendar.MONDAY);
            // 获取星期一开始时间戳
            cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            cal.setTime(remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(cal.getTime()) + START_TIME));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return cal.getTime();
    }

    /**
     * 获得本周的最后一天，周日
     *
     * @return
     */
    public static Date getCurrentWeekDayEndTime() {

        Calendar cal = Calendar.getInstance();
        try {

            cal.setFirstDayOfWeek(Calendar.MONDAY);
            // 获取星期一开始时间戳
            cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            cal.setTime(remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(cal.getTime()) + END_TIME));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return cal.getTime();
    }

    /**
     * 获得本天的开始时间
     *
     * @return
     */
    public static Date getCurrentDayStartTime() {
        Date now = new Date();
        try {
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(now) + START_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 获得本天的结束时间
     *
     * @return
     */
    public static Date getCurrentDayEndTime() {
        Date now = new Date();
        try {
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(now) + END_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }


    /**
     * 获得本小时的开始时间
     *
     * @return
     */
    public static Date getCurrentHourStartTime() {
        Date now = new Date();
        try {
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_HOUR_SDF.parse(remindDateUtils.LONG_HOUR_SDF.format(now));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 获得本小时的结束时间
     *
     * @return
     */
    public static Date getCurrentHourEndTime() {
        Date now = new Date();
        try {
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.LONG_HOUR_SDF.format(now) + ":59:59");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 获得本月的开始时间
     *
     * @return
     */
    public static Date getCurrentMonthStartTime() {
        Calendar c = Calendar.getInstance();
        Date now = null;
        try {
            c.set(Calendar.DATE, 1);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.SHORT_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 本月的结束时间
     *
     * @return
     */
    public static Date getCurrentMonthEndTime() {
        Calendar c = Calendar.getInstance();
        Date now = null;
        try {
            c.set(Calendar.DATE, 1);
            c.add(Calendar.MONTH, 1);
            c.add(Calendar.DATE, -1);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()) + END_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 当前年的开始时间
     *
     * @return
     */
    public static Date getCurrentYearStartTime() {
        Calendar c = Calendar.getInstance();
        Date now = null;
        try {
            c.set(Calendar.MONTH, 0);
            c.set(Calendar.DATE, 1);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.SHORT_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 当前年的结束时间
     *
     * @return
     */
    public static Date getCurrentYearEndTime() {
        Calendar c = Calendar.getInstance();
        Date now = null;
        try {
            c.set(Calendar.MONTH, 11);
            c.set(Calendar.DATE, 31);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()) + END_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 当前昨天的开始时间
     *
     * @return
     */
    public static Date getCurrentYesterdayStartTime() {
        Calendar c = Calendar.getInstance();
        Date now = null;
        try {
            c.add(Calendar.DATE, -1);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.SHORT_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()) + START_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 当前昨天的结束时间
     *
     * @return
     */
    public static Date getCurrentYesterdayEndTime() {
        Calendar c = Calendar.getInstance();
        Date now = null;
        try {
            c.add(Calendar.DATE, -1);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()) + END_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 当前季度的开始时间
     *
     * @return
     */
    public static Date getCurrentQuarterStartTime() {
        Calendar c = Calendar.getInstance();
        int currentMonth = c.get(Calendar.MONTH) + 1;
        Date now = null;
        try {
            if (currentMonth >= 1 && currentMonth <= 3)
                c.set(Calendar.MONTH, 0);
            else if (currentMonth >= 4 && currentMonth <= 6)
                c.set(Calendar.MONTH, 3);
            else if (currentMonth >= 7 && currentMonth <= 9)
                c.set(Calendar.MONTH, 6);
            else if (currentMonth >= 10 && currentMonth <= 12)
                c.set(Calendar.MONTH, 9);
            c.set(Calendar.DATE, 1);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()) + START_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 当前季度的结束时间
     *
     * @return
     */
    public static Date getCurrentQuarterEndTime() {
        Calendar c = Calendar.getInstance();
        int currentMonth = c.get(Calendar.MONTH) + 1;
        Date now = null;
        try {
            if (currentMonth >= 1 && currentMonth <= 3) {
                c.set(Calendar.MONTH, 2);
                c.set(Calendar.DATE, 31);
            } else if (currentMonth >= 4 && currentMonth <= 6) {
                c.set(Calendar.MONTH, 5);
                c.set(Calendar.DATE, 30);
            } else if (currentMonth >= 7 && currentMonth <= 9) {
                c.set(Calendar.MONTH, 8);
                c.set(Calendar.DATE, 30);
            } else if (currentMonth >= 10 && currentMonth <= 12) {
                c.set(Calendar.MONTH, 11);
                c.set(Calendar.DATE, 31);
            }
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()) + END_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    /**
     * 获取前/后半年的开始时间
     *
     * @return
     */
    public static Date getHalfYearStartTime() {
        Calendar c = Calendar.getInstance();
        int currentMonth = c.get(Calendar.MONTH) + 1;
        Date now = null;
        try {
            if (currentMonth >= 1 && currentMonth <= 6) {
                c.set(Calendar.MONTH, 0);
            } else if (currentMonth >= 7 && currentMonth <= 12) {
                c.set(Calendar.MONTH, 6);
            }
            c.set(Calendar.DATE, 1);
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()) + START_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;

    }

    /**
     * 获取前/后半年的结束时间
     *
     * @return
     */
    public static Date getHalfYearEndTime() {
        Calendar c = Calendar.getInstance();
        int currentMonth = c.get(Calendar.MONTH) + 1;
        Date now = null;
        try {
            if (currentMonth >= 1 && currentMonth <= 6) {
                c.set(Calendar.MONTH, 5);
                c.set(Calendar.DATE, 30);
            } else if (currentMonth >= 7 && currentMonth <= 12) {
                c.set(Calendar.MONTH, 11);
                c.set(Calendar.DATE, 31);
            }
            RemindDateUtils remindDateUtils = new RemindDateUtils();
            now = remindDateUtils.LONG_SDF.parse(remindDateUtils.SHORT_SDF.format(c.getTime()) + END_TIME);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return now;
    }

    public static String getMonthBegin(String dateStr) {
        Date date = null;
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        try {
            date = remindDateUtils.SHORT_SDF.parse(dateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        //设置为1号,当前日期既为本月第一天
        c.set(Calendar.DAY_OF_MONTH, 1);
        //将小时至0
        c.set(Calendar.HOUR_OF_DAY, 0);
        //将分钟至0
        c.set(Calendar.MINUTE, 0);
        //将秒至0
        c.set(Calendar.SECOND, 0);
        //将毫秒至0
        c.set(Calendar.MILLISECOND, 0);
        // 获取本月第一天的时间
        return remindDateUtils.SHORT_SDF.format(c.getTime());
    }

    public static String getMonthEnd(String dateStr) {
        Date date = null;
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        try {
            date = remindDateUtils.SHORT_SDF.parse(dateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        //设置为当月最后一天
        c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));
        //将小时至23
        c.set(Calendar.HOUR_OF_DAY, 23);
        //将分钟至59
        c.set(Calendar.MINUTE, 59);
        //将秒至59
        c.set(Calendar.SECOND, 59);
        //将毫秒至999
        c.set(Calendar.MILLISECOND, 999);
        // 获取本月最后一天的时间
        return remindDateUtils.SHORT_SDF.format(c.getTime());
    }

    public static int getDateSpace(String date1, String date2) {
        int days = 0;
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        try {
            Calendar calst = Calendar.getInstance();
            Calendar caled = Calendar.getInstance();
            calst.setTime(remindDateUtils.SHORT_SDF.parse(date1));
            caled.setTime(remindDateUtils.SHORT_SDF.parse(date2));
            //设置时间为0时
            calst.set(Calendar.HOUR_OF_DAY, 0);
            calst.set(Calendar.MINUTE, 0);
            calst.set(Calendar.SECOND, 0);
            caled.set(Calendar.HOUR_OF_DAY, 0);
            caled.set(Calendar.MINUTE, 0);
            caled.set(Calendar.SECOND, 0);
            //得到两个日期相差的天数
            days = ((int) (caled.getTime().getTime() / 1000) - (int) (calst.getTime().getTime() / 1000)) / 3600 / 24;
        } catch (ParseException e) {
            e.printStackTrace();
            e.printStackTrace();
        }

        return days;
    }

    /**
     * 取得当月天数
     */
    public static int getCurrentMonthLastDay() {
        Calendar a = Calendar.getInstance();
        a.set(Calendar.DATE, 1);
        a.roll(Calendar.DATE, -1);
        return a.get(Calendar.DATE);
    }

    //判断是否是同一个月
    public static boolean isBeforeMonth(String beforeMonth, String currentMonth) {
        Date bm = DateUtil.parse(beforeMonth, YEAR_MONTH);
        Date cm = DateUtil.parse(currentMonth, YEAR_MONTH);
        Calendar cmCal = Calendar.getInstance();
        Calendar bmCal = Calendar.getInstance();
        cmCal.setTime(cm);
        bmCal.setTime(bm);
        boolean isSameYear = cmCal.get(Calendar.YEAR) == bmCal
                .get(Calendar.YEAR);
        return isSameYear
                && cmCal.get(Calendar.MONTH) == bmCal.get(Calendar.MONTH);
    }

    public static String nextMonth(String day) {
        Date bm = DateUtil.parse(day, YEAR_MONTH);
        Calendar cmCal = Calendar.getInstance();
        cmCal.setTime(bm);
        cmCal.add(Calendar.MONTH, 1);
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        return remindDateUtils.SHORT_SDF.format(cmCal.getTime());
    }

    public static String upMonth(String day) {
        Date bm = DateUtil.parse(day, YEAR_MONTH);
        Calendar cmCal = Calendar.getInstance();
        cmCal.setTime(bm);
        cmCal.add(Calendar.MONTH, -1);
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        return remindDateUtils.SHORT_SDF.format(cmCal.getTime());
    }

    public static int getDay(String day) {
        Date bm = DateUtil.parse(day, YEAR_MONTH_DAY);
        Calendar cmCal = Calendar.getInstance();
        cmCal.setTime(bm);
        return cmCal.get(Calendar.DATE);
    }

    public static Integer getWeek(String day) {
        Integer week = null;
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        try {
            Date today = remindDateUtils.SHORT_SDF.parse(day);
            Calendar c = Calendar.getInstance();
            c.setTime(today);
            int weekday = c.get(Calendar.DAY_OF_WEEK);
            if (weekday == 1) {
                week = 7;
            } else {
                week = weekday - 1;
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return week;
    }

    public static Map<String, Integer> getWeeks(String day) {
        Date bm = DateUtil.parse(day, YEAR_MONTH_DAY);
        Calendar c = Calendar.getInstance();
        c.setTime(bm);
        int maxDay = c.getActualMaximum(Calendar.DAY_OF_MONTH);
        int days = c.get(Calendar.DATE);
        Map<String, Integer> map = new HashMap<>();
        map.put("week", (maxDay - days + 1) / 7);
        map.put("left", (maxDay - days + 1) % 7);
        return map;
    }

    /**
     * 获取之前多少天日期
     *
     * @param days
     * @return
     */
    public static String getDaysBefore(Integer days) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - days);
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        return remindDateUtils.SHORT_SDF.format(calendar.getTime());
    }

    /**
     * 根据传入时间获取获取开始结束当天时间
     *
     * @param days
     * @return
     */
    public static Date[] getStartAndEnd(String days) {
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        try {
            Date date1 = remindDateUtils.LONG_SDF.parse(days + START_TIME);
            Date date2 = remindDateUtils.LONG_SDF.parse(days + END_TIME);
            return new Date[]{date1, date2};
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取时间段内所有日期
     *
     * @param start 开始时间
     * @param end   结束时间
     * @return List
     */
    public static List<String> getBetweenDates(String start, String end) {
        List<String> result = new ArrayList<>();
        RemindDateUtils remindDateUtils = new RemindDateUtils();
        try {
            Date startDate = remindDateUtils.SHORT_SDF.parse(start);
            Date endDate = remindDateUtils.SHORT_SDF.parse(end);
            Calendar tempStart = Calendar.getInstance();
            tempStart.setTime(startDate);
            Calendar tempEnd = Calendar.getInstance();
            tempEnd.setTime(endDate);
            while (tempStart.before(tempEnd) || tempStart.equals(tempEnd)) {
                result.add(remindDateUtils.SHORT_SDF.format(tempStart.getTime()));
                tempStart.add(Calendar.DAY_OF_YEAR, 1);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Collections.reverse(result);
        return result;

    }


    /**
     * 折线图 时间处理
     *
     * @param year  结束年份 -从这个时间往前推
     * @param month 结束月份 -从这个时间往前推
     * @param type  时间类型 0-月 1-年
     * @return
     */
    public static synchronized List<TimeListParam> getTimeListParam(Integer year, Integer month, Integer type) {
        List<TimeListParam> result = new ArrayList<>();
        if (year == null) {
            year = LocalDate.now().getYear();
        }
        if (month == null) {
            month = LocalDate.now().getMonthValue();
        }

        if (Objects.equals(type, 1)) {
            for (int i = 0; i < 5; i++) {
                TimeListParam timeListParam = new TimeListParam();
                timeListParam.setYear(year - i);
                result.add(timeListParam);
            }
            return result;
        }

        if (Objects.equals(type, 0)) {
            YearMonth current = YearMonth.of(year, month);
            TimeListParam timeListParam = new TimeListParam();
            timeListParam.setYear(current.getYear());
            timeListParam.setMonth(current.getMonthValue());
            result.add(timeListParam);
            for (int i = 0; i < 5; i++) {
                YearMonth yearMonth = current.minusMonths(1);
                TimeListParam last = new TimeListParam();
                last.setYear(yearMonth.getYear());
                last.setMonth(yearMonth.getMonthValue());
                result.add(last);
            }
            return result;
        }
        return result;
    }
}