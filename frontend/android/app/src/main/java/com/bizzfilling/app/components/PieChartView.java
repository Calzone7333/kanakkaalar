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

public class PieChartView extends View {
    private List<PieSlice> slices = new ArrayList<>();
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF rectF = new RectF();

    public PieChartView(Context context) {
        super(context);
    }

    public PieChartView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    private float animationProgress = 0f;

    public void setData(List<PieSlice> data) {
        this.slices = data;
        // Start Animation
        animationProgress = 0f;
        animateChart();
    }
    
    private void animateChart() {
        android.animation.ValueAnimator animator = android.animation.ValueAnimator.ofFloat(0f, 1f);
        animator.setDuration(1000);
        animator.setInterpolator(new android.view.animation.DecelerateInterpolator());
        animator.addUpdateListener(val -> {
            animationProgress = (float) val.getAnimatedValue();
            invalidate();
        });
        animator.start();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        
        // ... (Empty check logic same as before, omitted for brevity, will be kept) ...
        if (slices == null || slices.isEmpty()) {
             paint.setColor(0xFFE5E7EB);
             paint.setStyle(Paint.Style.STROKE);
             paint.setStrokeWidth(20);
             float cx = getWidth() / 2f;
             float cy = getHeight() / 2f;
             float r = Math.min(cx, cy) - 20;
             canvas.drawCircle(cx, cy, r, paint);
             return;
        }

        float totalValue = 0;
        for (PieSlice slice : slices) totalValue += slice.value;

        float centerX = getWidth() / 2f;
        float centerY = getHeight() / 2f;
        float radius = Math.min(centerX, centerY) - 30; 
        
        // --- 3D EFFECT: Draw Shadow Layer first ---
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(40);
        rectF.set(centerX - radius, centerY - radius + 5, centerX + radius, centerY + radius + 5); // Offset Y by 5
        
        if (totalValue > 0) {
            float shadowStartAngle = -90;
            for (PieSlice slice : slices) {
                float sweep = (slice.value / totalValue) * 360f * animationProgress;
                // Darken color for shadow
                int shadowColor = darkenColor(slice.color, 0.8f); 
                paint.setColor(shadowColor);
                if (sweep > 0) canvas.drawArc(rectF, shadowStartAngle, sweep, false, paint);
                shadowStartAngle += sweep;
            }
        }
        
        // --- MAIN LAYER ---
        rectF.set(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
        float startAngle = -90; 
        
        // Draw Track
        paint.setColor(0xFFF3F4F6); 
        canvas.drawCircle(centerX, centerY, radius, paint);

        if (totalValue == 0) return;

        for (PieSlice slice : slices) {
            float sweepAngle = (slice.value / totalValue) * 360f * animationProgress;
            
            if (sweepAngle > 0) {
                paint.setColor(slice.color);
                // Add emboss effect for 3D look
                paint.setShadowLayer(4, 0, 2, 0x40000000);
                canvas.drawArc(rectF, startAngle, sweepAngle, false, paint);
                paint.clearShadowLayer(); // Clear for next draw
                startAngle += sweepAngle;
            }
        }
        
        // Center Text
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(0xFF374151); 
        paint.setTextSize(40);
        paint.setTextAlign(Paint.Align.CENTER);
        paint.setFakeBoldText(true);
        float textY = centerY - ((paint.descent() + paint.ascent()) / 2);
        canvas.drawText(String.valueOf((int)(totalValue * animationProgress)), centerX, textY, paint);
    }
    
    private int darkenColor(int color, float factor) {
        int a = android.graphics.Color.alpha(color);
        int r = Math.round(android.graphics.Color.red(color) * factor);
        int g = Math.round(android.graphics.Color.green(color) * factor);
        int b = Math.round(android.graphics.Color.blue(color) * factor);
        return android.graphics.Color.argb(a, Math.min(r,255), Math.min(g,255), Math.min(b,255));
    }

    public static class PieSlice {
        public float value;
        public int color;

        public PieSlice(float value, int color) {
            this.value = value;
            this.color = color;
        }
    }
}
