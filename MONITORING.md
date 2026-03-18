# Monitoring Setup

## CloudWatch Logs

- Log group: `/aws/ec2/pet-social-backend`
- Captured from EC2 CloudWatch Agent :
  ![Log group](image-1.png)

## CloudWatch Metrics

- CPU Utilization
- Memory Used %
- Disk Used %

## CloudWatch Alarms

- CPU > 80% → SNS email
![CPUUtilization Alarm](image-2.png)

- Memory > 85% → SNS email
![Memory Alarm](image-3.png)

- Existing Error log alarm  > 0 -> SNS email
![The error from calling API](image-4.png)
## Dashboard

- https://console.aws.amazon.com/cloudwatch → PetSocialApp-Dashboard
  ![CloudWatch Board](image.png)

Follow visually about CPU Utilization or Used Memory Statistic, especially it is able to track logs from EC2 backend to fix errors timely .