package com.bizzfilling.app.components;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.View;
import androidx.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;

public class BarChartView extends View {
    private List<BarData> data = new ArrayList<>();
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF rectF = new RectF();
    private float animationProgress = 0f;

    public BarChartView(Context context) {
        super(context);
    }

    public BarChartView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public void setData(List<BarData> data) {
        this.data = data;
        animationProgress = 0f;
        animateChart();
    }
    
    private void animateChart() {
        android.animation.ValueAnimator animator = android.animation.ValueAnimator.ofFloat(0f, 1f);
        animator.setDuration(1200);
        animator.setInterpolator(new android.view.animation.BounceInterpolator()); // Bouncy effect
        animator.addUpdateListener(val -> {
            animationProgress = (float) val.getAnimatedValue();
            invalidate();
        });
        animator.start();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        if (data == null || data.isEmpty()) return;

        float width = getWidth();
        float height = getHeight();
        float padding = 40f;
        
        float availableWidth = width - (padding * 2);
        float barWidth = availableWidth / (data.size() * 2); // Spacing = barWidth
        float maxBarHeight = height - (padding * 2);
        
        // Find max value for scaling
        float maxValue = 0;
        for (BarData item : data) {
            maxValue = Math.max(maxValue, Math.max(item.value1, item.value2));
        }
        if (maxValue == 0) maxValue = 1; // Prevent div by zero

        float startX = padding;
        float bottomY = height - padding;

        for (BarData item : data) {
            // Draw Bar 1 (Leads - Blue)
            float barHeight1 = (item.value1 / maxValue) * maxBarHeight * animationProgress;
            paint.setColor(0xFF3B82F6); // Blue
            
            // 3D Side (Right)
            float depth = 15f;
            android.graphics.Path sidePath = new android.graphics.Path();
            sidePath.moveTo(startX + barWidth, bottomY - barHeight1);
            sidePath.lineTo(startX + barWidth + depth, bottomY - barHeight1 - depth);
            sidePath.lineTo(startX + barWidth + depth, bottomY - depth);
            sidePath.lineTo(startX + barWidth, bottomY);
            sidePath.close();
            paint.setColor(darkenColor(0xFF3B82F6, 0.7f));
            canvas.drawPath(sidePath, paint);
            
            // 3D Top
            android.graphics.Path topPath = new android.graphics.Path();
            topPath.moveTo(startX, bottomY - barHeight1);
            topPath.lineTo(startX + depth, bottomY - barHeight1 - depth);
            topPath.lineTo(startX + barWidth + depth, bottomY - barHeight1 - depth);
            topPath.lineTo(startX + barWidth, bottomY - barHeight1);
            topPath.close();
            paint.setColor(darkenColor(0xFF3B82F6, 0.9f));
            canvas.drawPath(topPath, paint);

            // Front Face
            paint.setColor(0xFF3B82F6);
            rectF.set(startX, bottomY - barHeight1, startX + barWidth, bottomY);
            canvas.drawRect(rectF, paint);


            startX += barWidth + 10; // Small gap between bars in same group

            // Draw Bar 2 (Deals - Green)
            float barHeight2 = (item.value2 / maxValue) * maxBarHeight * animationProgress;
            
            // 3D Side (Right)
            paint.setColor(darkenColor(0xFF10B981, 0.7f));
            sidePath.reset();
            sidePath.moveTo(startX + barWidth, bottomY - barHeight2);
            sidePath.lineTo(startX + barWidth + depth, bottomY - barHeight2 - depth);
            sidePath.lineTo(startX + barWidth + depth, bottomY - depth);
            sidePath.lineTo(startX + barWidth, bottomY);
            sidePath.close();
            canvas.drawPath(sidePath, paint);

            // 3D Top
            paint.setColor(darkenColor(0xFF10B981, 0.9f));
            topPath.reset();
            topPath.moveTo(startX, bottomY - barHeight2);
            topPath.lineTo(startX + depth, bottomY - barHeight2 - depth);
            topPath.lineTo(startX + barWidth + depth, bottomY - barHeight2 - depth);
            topPath.lineTo(startX + barWidth, bottomY - barHeight2);
            topPath.close();
            canvas.drawPath(topPath, paint);

            // Front Face
            paint.setColor(0xFF10B981); // Green
            rectF.set(startX, bottomY - barHeight2, startX + barWidth, bottomY);
            canvas.drawRect(rectF, paint);

            startX += barWidth + (barWidth); // Move to next group
        }
    }

    private int darkenColor(int color, float factor) {
        int a = android.graphics.Color.alpha(color);
        int r = Math.round(android.graphics.Color.red(color) * factor);
        int g = Math.round(android.graphics.Color.green(color) * factor);
        int b = Math.round(android.graphics.Color.blue(color) * factor);
        return android.graphics.Color.argb(a, Math.min(r,255), Math.min(g,255), Math.min(b,255));
    }

    public static class BarData {
        public String label;
        public float value1;
        public float value2;

        public BarData(String label, float value1, float value2) {
            this.label = label;
            this.value1 = value1;
            this.value2 = value2;
        }
    }
}
