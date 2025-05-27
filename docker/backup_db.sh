   #!/bin/bash
   BACKUP_DIR="/home/project/ai-weather"
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   mkdir -p $BACKUP_DIR
   
   # 数据库备份
   docker exec ai-pg pg_dump -U postgres ai_weather > $BACKUP_DIR/ai_weather_$TIMESTAMP.sql
   
   # 保留最近7天的备份，删除旧备份
   find $BACKUP_DIR -name "ai_weather_*.sql" -type f -mtime +7 -delete
   
   # 压缩备份
   gzip $BACKUP_DIR/ai_weather_$TIMESTAMP.sql
   
   echo "备份完成: $BACKUP_DIR/ai_weather_$TIMESTAMP.sql.gz"