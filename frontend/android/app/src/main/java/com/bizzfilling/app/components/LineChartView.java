package com.bizzfilling.app.components;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Shader;
import android.util.AttributeSet;
import android.view.View;
import androidx.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;

public class LineChartView extends View {

    private List<Float> dataPoints = new ArrayList<>();
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Path path = new Path();
    private final Path fillPath = new Path();
    private float animationProgress = 0f;

    public LineChartView(Context context) {
        super(context);
    }

    public LineChartView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public void setData(List<Float> data) {
        this.dataPoints = data;
        animationProgress = 0f;
        animateChart();
    }

    private void animateChart() {
        android.animation.ValueAnimator animator = android.animation.ValueAnimator.ofFloat(0f, 1f);
        animator.setDuration(1500);
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

        if (dataPoints == null || dataPoints.size() < 2) return;

        float width = getWidth();
        float height = getHeight();
        float paddingTop = 20f;
        float paddingBottom = 20f;
        
        // Calculate X spacing
        float xSpacing = width / (dataPoints.size() - 1);
        
        // Find min/max for Y scaling
        float maxVal = 0;
        for (float f : dataPoints) maxVal = Math.max(maxVal, f);
        if (maxVal == 0) maxVal = 1;

        float graphHeight = height - paddingTop - paddingBottom;
        
        path.reset();
        fillPath.reset();
        
        // Start point
        float startX = 0;
        float startY = height - paddingBottom - (dataPoints.get(0) / maxVal * graphHeight * animationProgress);
        
        path.moveTo(startX, startY);
        fillPath.moveTo(startX, height); // Bottom left
        fillPath.lineTo(startX, startY);

        for (int i = 1; i < dataPoints.size(); i++) {
            float x = i * xSpacing;
            float y = height - paddingBottom - (dataPoints.get(i) / maxVal * graphHeight * animationProgress);
            
            // Cubic Bezier for smooth curve
            float prevX = (i - 1) * xSpacing;
            float prevY = height - paddingBottom - (dataPoints.get(i - 1) / maxVal * graphHeight * animationProgress);
            
            float midX = (prevX + x) / 2;
            path.cubicTo(midX, prevY, midX, y, x, y);
            fillPath.cubicTo(midX, prevY, midX, y, x, y);
        }
        
        fillPath.lineTo(width, height); // Bottom right
        fillPath.close();

        // Draw Look: 3D Ribbon / Glowing Effect
        
        // 1. Draw Fill Gradient (Area)
        paint.setStyle(Paint.Style.FILL);
        paint.setShader(new LinearGradient(0, 0, 0, height, 
            0x40A855F7, // Purple with alpha
            0x00A855F7, // Transparent
            Shader.TileMode.CLAMP));
        canvas.drawPath(fillPath, paint);
        paint.setShader(null);

        // 2. Draw Shadow Line (Depth)
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(8f);
        paint.setColor(0x20000000); // Shadow color
        canvas.drawPath(path, paint); // Slightly offset implicitly by order, or could translate canvas
        
        // 3. Draw Main Line
        paint.setStrokeWidth(6f);
        paint.setColor(0xFFA855F7); // Purple main color
        paint.setShadowLayer(12, 0, 6, 0x40A855F7); // Glow
        canvas.drawPath(path, paint);
        
        // 4. Draw Points (Dots)
        paint.setStyle(Paint.Style.FILL);
        paint.setShadowLayer(0,0,0,0);
        for (int i = 0; i < dataPoints.size(); i++) {
            float x = i * xSpacing;
            float y = height - paddingBottom - (dataPoints.get(i) / maxVal * graphHeight * animationProgress);
            
            paint.setColor(0xFFFFFFFF); // White center
            canvas.drawCircle(x, y, 8f, paint);
            
            paint.setStyle(Paint.Style.STROKE);
            paint.setStrokeWidth(3f);
            paint.setColor(0xFFA855F7); // Purple ring
            canvas.drawCircle(x, y, 8f, paint);
            paint.setStyle(Paint.Style.FILL);
        }
    }
}
