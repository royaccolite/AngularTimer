import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})

export class CountdownTimerComponent implements OnInit, OnDestroy {
  private minute: number = 60000; // 1 minute in milliseconds
  private second: number = 1000;

  minutes: number = 0;
  seconds: number = 0;
  private countdownInterval: any;
  private countDownTime: number = 0;
  private isPaused: boolean = false;

  @ViewChild('countdown') countdown!: ElementRef;

  constructor(private renderer: Renderer2) {}
  
  ngOnInit(): void {
    this.minutes = 5;
    this.seconds = 0;
  }

  ngAfterViewInit() {
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const pauseButton = document.getElementById("pauseButton");
    const resumeButton = document.getElementById("resumeButton");

    if (startButton) {
      startButton.addEventListener("click", this.startTimer.bind(this));
    }

    if (resetButton) {
      resetButton.addEventListener("click", this.resetTimer.bind(this));
    }

    if (pauseButton) {
      pauseButton.addEventListener("click", this.pauseTimer.bind(this));
    }

    if (resumeButton) {
      resumeButton.addEventListener("click", this.resumeTimer.bind(this));
    }

    this.disablePauseResumeButtons();
  }

  ngOnDestroy() {
    clearInterval(this.countdownInterval);
  }

  public updateTimer() {
    if (!this.isPaused) {
      const now = new Date().getTime(),
        distance = this.countDownTime - now;
  
      if (distance <= 0) {
        // Timer reached 0 or went negative, show the content
        clearInterval(this.countdownInterval);
        this.countDownTime = now; // Set remaining time to 0
        this.disablePauseResumeButtons(); // Disable pause/resume buttons
  
        // Hide other elements
        const headlineElement = document.getElementById("headline");
        const countdownElement = document.getElementById("countdown");
        const buttonsElement = document.getElementById("buttons");
  
        if (headlineElement && countdownElement && buttonsElement) {
          headlineElement.style.display = "none";
          countdownElement.style.display = "none";
          buttonsElement.style.display = "none";
        }
  
        // Display the content
        const contentElement = document.getElementById("content");
        if (contentElement) {
          contentElement.style.display = "block";
        }
        document.title="🥳 🎉 🎂";
        return; // Stop the function if the timer has reached 0
      }
  
      const minutesElement = document.getElementById("minutes");
      const secondsElement = document.getElementById("seconds");
  
      if (minutesElement && secondsElement) {
        const minutesValue = Math.max(Math.floor(distance / this.minute), 0).toString();
        const secondsValue = Math.max(Math.floor((distance % this.minute) / this.second), 0).toString();
  
        minutesElement.innerText = minutesValue;
        secondsElement.innerText = secondsValue;
  
        const minutesDisplay = minutesValue;
        const secondsDisplay = secondsValue;
  
        document.title = `${minutesDisplay}m ${secondsDisplay}s`;
      }
    }
  }
  
  
  

  public startTimer() {
    this.countDownTime = new Date().getTime() + this.getStoredRemainingTime();
    this.updateTimer();
    this.countdownInterval = setInterval(this.updateTimer.bind(this), 1000);
    this.enablePauseResumeButtons();
    
  }

  public resetTimer() {
    clearInterval(this.countdownInterval);

    const headlineElement = document.getElementById("headline");
    const countdownElement = document.getElementById("countdown");
    const contentElement = document.getElementById("content");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (headlineElement) {
      headlineElement.innerText = "Submission in:";
    }

    if (countdownElement) {
      countdownElement.style.display = "block";
    }

    if (contentElement) {
      contentElement.style.display = "none";
    }

    if (minutesElement) {
      minutesElement.innerText = "5";
    }

    if (secondsElement) {
      secondsElement.innerText = "0";
    }

    this.countDownTime = new Date().getTime() + this.getStoredRemainingTime();
    this.clearStoredRemainingTime();
    
  }

  public pauseTimer() {
    clearInterval(this.countdownInterval);
    this.isPaused = true;
    this.storeRemainingTime();
    this.disablePauseResumeButtons();
  }

  public resumeTimer() {
    this.isPaused = false;
    this.startTimer();
  }

  private storeRemainingTime() {
    const remainingTime = this.countDownTime - new Date().getTime();
    localStorage.setItem("remainingTime", remainingTime.toString());
  }

  private clearStoredRemainingTime() {
    localStorage.removeItem("remainingTime");
  }

  private getStoredRemainingTime() {
    const storedValue = localStorage.getItem("remainingTime");
    const parsedValue = parseInt(storedValue || "", 10);

    return !isNaN(parsedValue) ? parsedValue : 5 * this.minute;
  }

  private enablePauseResumeButtons() {
    const pauseButton = document.getElementById("pauseButton") as HTMLButtonElement;
    const resumeButton = document.getElementById("resumeButton") as HTMLButtonElement;

    if (pauseButton && resumeButton) {
      pauseButton.disabled = false;
      resumeButton.disabled = true;
    }
  }

  private disablePauseResumeButtons() {
    const pauseButton = document.getElementById("pauseButton") as HTMLButtonElement;
    const resumeButton = document.getElementById("resumeButton") as HTMLButtonElement;

    if (pauseButton && resumeButton) {
      pauseButton.disabled = true;
      resumeButton.disabled = false;
    }
  }
}
