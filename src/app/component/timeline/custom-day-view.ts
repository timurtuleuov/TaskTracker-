import { GanttView, GanttViewType, GanttViewDate, GanttViewOptions, GanttDate, GanttDatePoint, eachDayOfInterval, primaryDatePointTop, secondaryDatePointTop } from "@worktile/gantt";


export class GanttViewCustom extends GanttView {
    override showWeekBackdrop = true;

    override showTimeline = true;

    override viewType = GanttViewType.day;

    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, {showWeekend: true}, options));
    }

    viewStartOf(date: GanttDate) {
        return date.startOfWeek({ weekStartsOn: 1 });
    }

    viewEndOf(date: GanttDate) {
        return date.endOfWeek({ weekStartsOn: 1 });
    }

    getPrimaryWidth() {
        if (!true) {
            return this.getCellWidth() * 5;
        } else {
            return this.getCellWidth() * 7;
        }
    }

    getDayOccupancyWidth(date: GanttDate): number {
        if (!true && date.isWeekend()) {
            return 0;
        }
        return this.cellWidth;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        const dayInWeekMap: { [key: string]: string } = {
            '1': 'Понедельник',
            '2': 'Вторник',
            '3': 'Среда',
            '4': 'Четверг',
            '5': 'Пятница',
            '6': 'Суббота',
            '0': 'Воскресенье'
          };
          for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const dayIndex = start.getDay().toString();
            const point = new GanttDatePoint(
                start,
                `${dayInWeekMap[dayIndex]}`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                primaryDatePointTop,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
        
            if (isWeekend || start.isToday()) {
                point.style = { fill: '#ff9f73' };
            }
        
            points.push(point);
        }
        
        if (!this.options["showWeekend"]) {
            return points
                .filter((point) => !point.additions || !point.additions.isWeekend)
                .map((point, i) => {
                    return { ...point, x: i * this.getCellWidth() + this.getCellWidth() / 2 };
                });
        } else {
            return points;
        }
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < days.length; i++) {
            const start = new GanttDate(days[i]);
            const isWeekend = start.isWeekend();
            const point = new GanttDatePoint(
                start,
                `${start.format('MM/d')}`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            if (isWeekend || start.isToday()) {
                point.style = { fill: '#ff9f73' };
            }
            points.push(point);
        }
    
        if (!true) {
            return points
                .filter((point) => !point.additions || !point.additions.isWeekend)
                .map((point, i) => {
                    return { ...point, x: i * this.getCellWidth() + this.getCellWidth() / 2 };
                });
        } else {
            return points;
        }
    }
}